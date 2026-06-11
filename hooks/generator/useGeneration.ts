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

function deriveProductId(filename?: string | null): string {
  if (!filename) return "front-design";
  let name = filename.replace(/\\/g, "/");
  const slash = name.lastIndexOf("/");
  if (slash >= 0) name = name.slice(slash + 1);
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

const plural = (n: number) => (n !== 1 ? "s" : "");

const errMsg = (err: unknown, fallback = "unknown error") =>
  err instanceof Error ? err.message : fallback;

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
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const pollJobUntilTerminal = (jobId: string): Promise<BatchStatus> =>
    new Promise((resolve, reject) => {
      pollRef.current = setInterval(async () => {
        try {
          const batchStatus = await batchService.getBatchStatus(jobId);
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

  const finish = (message: string, severity: GeneratorStatus["severity"]) => {
    setGenerating(false);
    setProgress({ completed: 0, total: 0 });
    setStatus({ open: true, message, severity });
  };

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
    setStatus({ open: true, message: "Starting batch…", severity: "info" });

    let imageJobId: string;
    let imageStatus: BatchStatus;
    try {
      ({ jobId: imageJobId } = await batchService.startBatch({
        frontDesign: frontDesign!,
        backDesign: backDesign!,
        modelId: selectedModelId!,
        folderId: selectedProjectId!,
        options,
      }));
    } catch (err) {
      return finish(
        errMsg(err, "Failed to start batch. Please try again."),
        "error",
      );
    }

    setStatus({
      open: true,
      message: "Generating garment assets…",
      severity: "info",
    });

    try {
      imageStatus = await pollJobUntilTerminal(imageJobId);
    } catch {
      return finish("Lost connection while checking batch progress.", "error");
    }

    if (imageStatus.status === "FAILED") {
      const detail =
        imageStatus.errorMessage ?? imageStatus.failedItems[0]?.reason;
      return finish(
        `Batch failed: ${imageStatus.failedItems.length} combinations could not be generated after retries.${detail ? ` (${detail})` : ""}`,
        "error",
      );
    }

    setGeneratedAssets(imageStatus.assets);
    const imageCount = imageStatus.uploadedCount;
    const images = `${imageCount} image asset${plural(imageCount)}`;

    if (!video?.enabled) {
      if (imageStatus.status === "PARTIAL") {
        const fails = imageStatus.failedItems.length;
        return finish(
          `${imageCount} asset${plural(imageCount)} generated with ${fails} failure${plural(fails)}. Click to view.`,
          "warning",
        );
      }
      return finish(
        `${imageCount} asset${plural(imageCount)} generated in "${selectedProjectName}". Click to view.`,
        "success",
      );
    }

    setStatus({
      open: true,
      message: "Generating turntable video…",
      severity: "info",
    });

    let videoJobId: string;
    let videoStatus: BatchStatus;
    try {
      ({ jobId: videoJobId } = await videoService.startVideo({
        imageJobId,
        productId: deriveProductId(frontDesign?.name),
        folderId: selectedProjectId!,
        durationSeconds: video.durationSeconds,
        prompt: video.prompt,
      }));
    } catch (err) {
      return finish(
        `${images} generated, but the video failed to start: ${errMsg(err)}`,
        "warning",
      );
    }

    try {
      videoStatus = await pollJobUntilTerminal(videoJobId);
    } catch {
      return finish("Lost connection while checking video progress.", "error");
    }

    if (videoStatus.status === "DONE" && videoStatus.assets) {
      setGeneratedAssets((prev) => [...(prev ?? []), ...videoStatus.assets!]);
      return finish(
        `${images} + video generated in "${selectedProjectName}". Click to view.`,
        "success",
      );
    }

    const reason =
      videoStatus.errorMessage ??
      videoStatus.failedItems[0]?.reason ??
      "unknown error";
    return finish(
      `${images} generated, but the video failed: ${reason}`,
      "warning",
    );
  };

  const handleSnackbarClick = () => {
    if (status.severity === "success" || status.severity === "warning") {
      router.push(
        selectedProjectId
          ? `/assets?projectId=${selectedProjectId}`
          : "/assets",
      );
    }
  };

  const closeStatus = () => setStatus((s) => ({ ...s, open: false }));

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
