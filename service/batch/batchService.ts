import { authHeaders, getJson, postForJobId } from "@/service/http/jobClient";
import type { BatchStatus, Resolution, FrameOutputFormat } from "@/types/types";

interface BatchSubmitParams {
  frontDesign: File;
  backDesign: File;
  modelId: number;
  folderId: number;
  options?: {
    resolution?: Resolution;
    frameOutputFormat?: FrameOutputFormat;
    prompt?: string;
  };
}

class BatchService {
  async startBatch({
    frontDesign,
    backDesign,
    modelId,
    folderId,
    options,
  }: BatchSubmitParams): Promise<{ jobId: string }> {
    const formData = new FormData();
    formData.append("frontDesign", frontDesign);
    formData.append("backDesign", backDesign);
    formData.append("modelId", String(modelId));
    formData.append("folderId", String(folderId));

    const advancedSettings = {
      resolution: options?.resolution,
      outputFormat: options?.frameOutputFormat,
      prompt: options?.prompt,
    };
    formData.append(
      "advancedSettings",
      new Blob([JSON.stringify(advancedSettings)], {
        type: "application/json",
      }),
    );

    return postForJobId("/batches", formData, {}, "Failed to start batch");
  }

  getBatchStatus(jobId: string): Promise<BatchStatus> {
    return getJson<BatchStatus>(
      `/batches/${jobId}/status`,
      "Failed to get batch status",
    );
  }

  async downloadBatch(jobId: string): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/batches/${jobId}/download`,
      { method: "GET", headers: authHeaders() },
    );
    if (response.status === 409)
      throw new Error(
        "Job is not finished yet — please wait until generation completes.",
      );
    if (!response.ok) throw new Error("Failed to download batch results");

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `batch-${jobId}.zip`;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}

export default BatchService;
