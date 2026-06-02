import { getJwtToken } from "@/service/auth/auth_service";
import type {
  BatchStatus,
  Resolution,
  FrameOutputFormat,
} from "@/types/types";

interface BatchSubmitParams {
  frontDesign: File;
  backDesign: File;
  modelId: number;
  folderId: number;
  options?: {
    prompt?: string;
    resolution?: Resolution;
    frameOutputFormat?: FrameOutputFormat;
  };
}

class BatchService {
  private getAuthHeaders(): Record<string, string> {
    const token = getJwtToken();
    if (!token) throw new Error("JWT token is not set");
    return { Authorization: `Bearer ${token}` };
  }

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
    if (options) {
      if (options.prompt)
        formData.append("prompt", options.prompt);
      if (options.resolution)
        formData.append("resolution", options.resolution);
      if (options.frameOutputFormat)
        formData.append(
          "frameOutputFormat",
          options.frameOutputFormat,
        );
    }

    const queryParams = new URLSearchParams({
      modelId: String(modelId),
      folderId: String(folderId),
    });

    const url = `${process.env.NEXT_PUBLIC_API_URL}/batches?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || "Failed to start batch");
    }

    const text = await response.text();
    const jobId = text.split(": ").pop()?.trim();
    if (!jobId) throw new Error("Invalid response from server");
    return { jobId };
  }

  async getBatchStatus(
    jobId: string,
  ): Promise<BatchStatus> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/batches/${jobId}/status`;
    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok)
      throw new Error("Failed to get batch status");
    return response.json();
  }

  async downloadBatch(jobId: string): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/batches/${jobId}/download`;
    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    if (response.status === 409)
      throw new Error(
        "Job is not finished yet — please wait until generation completes.",
      );
    if (!response.ok)
      throw new Error("Failed to download batch results");
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
