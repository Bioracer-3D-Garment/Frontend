import { useState, useRef } from "react";
import { useRouter } from "next/router";
import type {
  GeneratorStatus,
  GeneratedAsset,
  Resolution,
  FrameOutputFormat,
  VideoOptions,
  BatchStatus,
} from "@/types/types";
import BatchService from "@/service/batch/batchService";
import VideoService from "@/service/video/videoService";

const batchService = new BatchService();
const videoService = new VideoService();
const POLL_INTERVAL_MS = 5000;

interface UseGenerationParams {
  frontDesign: File | null;
  backDesign: File | null;
  selectedModelId: number | null;
  selectedProjectName: string;
  selectedProjectId: number | null;
}

/**
 * Derives the productId the backend assigns from the front design's filename
 * (basename without extension). Must mirror AssetGenerationService.resolveProductId
 * so the video request can reference the same product.
 */
function deriveProductId(filename?: string | null): string {
  if (!filename) return "front-design";
  let name = filename.replace(/\\/g, "/");
  const slash = name.lastIndexOf("/");
  if (slash >= 0) name = name.slice(slash + 1);
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

export function useGeneration({
  frontDesign,
  backDesign,
  selectedModelId,
  selectedProjectName,
  selectedProjectId,
}: UseGenerationParams) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
  });
  const [status, setStatus] = useState<GeneratorStatus>({
    open: false,
    message: "",
    severity: "info",
  });
  const [generatedAssets, setGeneratedAssets] = useState<
    GeneratedAsset[] | null
  >(null);
  const pollRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);

  const canGenerate =
    frontDesign !== null &&
    backDesign !== null &&
    selectedModelId !== null &&
    selectedProjectId !== null;

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  /**
   * Polls a job (image batch or video) until it reaches a terminal state
   * (DONE / PARTIAL / FAILED). Resolves with the final status, rejects on a
   * connection error. Updates the progress bar on every tick.
   */
  const pollJobUntilTerminal = (jobId: string): Promise<BatchStatus> =>
    new Promise((resolve, reject) => {
      pollRef.current = setInterval(async () => {
        try {
          const batchStatus =
            await batchService.getBatchStatus(jobId);
          setProgress({
            completed: batchStatus.completed,
            total: batchStatus.total,
          });
          if (
            batchStatus.status === "DONE" ||
            batchStatus.status === "PARTIAL" ||
            batchStatus.status === "FAILED"
          ) {
            stopPolling();
            resolve(batchStatus);
          }
        } catch (err) {
          stopPolling();
          reject(err);
        }
      }, POLL_INTERVAL_MS);
    });

  const handleGenerate = async (
    options?: {
      resolution?: Resolution;
      frameOutputFormat?: FrameOutputFormat;
      prompt?: string;
    },
    video?: VideoOptions,
  ) => {
    setGenerating(true);
    setGeneratedAssets(null);
    setProgress({ completed: 0, total: 0 });
    setStatus({
      open: true,
      message: "Starting batch…",
      severity: "info",
    });

    // ---- 1. Start image batch ----
    let imageJobId: string;
    try {
      const result = await batchService.startBatch({
        frontDesign: frontDesign!,
        backDesign: backDesign!,
        modelId: selectedModelId!,
        folderId: selectedProjectId!,
        options,
      });
      imageJobId = result.jobId;
    } catch (err) {
      setGenerating(false);
      setStatus({
        open: true,
        message:
          err instanceof Error
            ? err.message
            : "Failed to start batch. Please try again.",
        severity: "error",
      });
      return;
    }

    setStatus({
      open: true,
      message: "Generating garment assets…",
      severity: "info",
    });

    // ---- 2. Poll image batch ----
    let imageStatus: BatchStatus;
    try {
      imageStatus = await pollJobUntilTerminal(imageJobId);
    } catch {
      setGenerating(false);
      setStatus({
        open: true,
        message: "Lost connection while checking batch progress.",
        severity: "error",
      });
      setProgress({ completed: 0, total: 0 });
      return;
    }

    if (imageStatus.status === "FAILED") {
      setGenerating(false);
      const failCount = imageStatus.failedItems.length;
      const detail =
        imageStatus.errorMessage ??
        imageStatus.failedItems[0]?.reason;
      setStatus({
        open: true,
        message: `Batch failed: ${failCount} combinations could not be generated after retries.${detail ? ` (${detail})` : ""}`,
        severity: "error",
      });
      setProgress({ completed: 0, total: 0 });
      return;
    }

    // Images are available (DONE or PARTIAL)
    setGeneratedAssets(imageStatus.assets);
    setProgress({ completed: 0, total: 0 });

    const imageFailCount = imageStatus.failedItems.length;
    const imageCount = imageStatus.uploadedCount;

    // ---- 3. Optionally generate the turntable video ----
    if (!video?.enabled) {
      setGenerating(false);
      setStatus({
        open: true,
        message:
          imageStatus.status === "PARTIAL"
            ? `${imageCount} asset${imageCount !== 1 ? "s" : ""} generated with ${imageFailCount} failure${imageFailCount !== 1 ? "s" : ""}. Click to view.`
            : `${imageCount} asset${imageCount !== 1 ? "s" : ""} generated in "${selectedProjectName}". Click to view.`,
        severity:
          imageStatus.status === "PARTIAL" ? "warning" : "success",
      });
      return;
    }

    setStatus({
      open: true,
      message: "Generating turntable video…",
      severity: "info",
    });

    let videoJobId: string;
    try {
      const result = await videoService.startVideo({
        imageJobId,
        productId: deriveProductId(frontDesign?.name),
        folderId: selectedProjectId!,
        durationSeconds: video.durationSeconds,
        prompt: video.prompt,
      });
      videoJobId = result.jobId;
    } catch (err) {
      setGenerating(false);
      setStatus({
        open: true,
        message: `${imageCount} image asset${imageCount !== 1 ? "s" : ""} generated, but the video failed to start: ${err instanceof Error ? err.message : "unknown error"}`,
        severity: "warning",
      });
      setProgress({ completed: 0, total: 0 });
      return;
    }

    let videoStatus: BatchStatus;
    try {
      videoStatus = await pollJobUntilTerminal(videoJobId);
    } catch {
      setGenerating(false);
      setStatus({
        open: true,
        message: "Lost connection while checking video progress.",
        severity: "error",
      });
      setProgress({ completed: 0, total: 0 });
      return;
    }

    setGenerating(false);
    setProgress({ completed: 0, total: 0 });

    if (videoStatus.status === "DONE" && videoStatus.assets) {
      setGeneratedAssets((prev) => [
        ...(prev ?? []),
        ...videoStatus.assets!,
      ]);
      setStatus({
        open: true,
        message: `${imageCount} image asset${imageCount !== 1 ? "s" : ""} + video generated in "${selectedProjectName}". Click to view.`,
        severity: "success",
      });
    } else {
      const reason =
        videoStatus.errorMessage ??
        videoStatus.failedItems[0]?.reason ??
        "unknown error";
      setStatus({
        open: true,
        message: `${imageCount} image asset${imageCount !== 1 ? "s" : ""} generated, but the video failed: ${reason}`,
        severity: "warning",
      });
    }
  };

  const handleSnackbarClick = () => {
    if (
      status.severity === "success" ||
      status.severity === "warning"
    ) {
      router.push(
        selectedProjectId
          ? `/assets?projectId=${selectedProjectId}`
          : "/assets",
      );
    }
  };

  const closeStatus = () =>
    setStatus((s) => ({ ...s, open: false }));

  return {
    generating,
    progress,
    canGenerate,
    handleGenerate,
    status,
    closeStatus,
    handleSnackbarClick,
    generatedAssets,
  };
}
