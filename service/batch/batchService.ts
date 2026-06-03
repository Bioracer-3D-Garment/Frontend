import { getJwtToken } from "@/service/auth/auth_service";
import type {
  BatchStatus,
  GarmentError,
  Resolution,
  FrameOutputFormat,
} from "@/types/types";

// Use lightweight local value types here instead of the full `GenerationOptions` type

interface BatchSubmitParams {
  garmentZip: File;
  gender: string;
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
    garmentZip,
    gender,
    folderId,
    options,
  }: BatchSubmitParams): Promise<{ jobId: string }> {
    const formData = new FormData();
    formData.append("garmentZip", garmentZip);
    formData.append("gender", gender);
    formData.append("folderId", String(folderId));
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

    const url = `${process.env.NEXT_PUBLIC_API_URL}/batches`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (response.status === 400) {
      const body = await response.json().catch(() => ({}));
      if (
        Array.isArray(body.garmentErrors) &&
        body.garmentErrors.length > 0
      ) {
        const issues = (
          body.garmentErrors as GarmentError[]
        )
          .map(
            (e) =>
              `${e.garment}: missing ${e.missing.join(", ")}`,
          )
          .join("; ");
        throw new Error(
          `ZIP validation failed — ${issues}`,
        );
      }
      throw new Error(body.message ?? "Invalid request");
    }

    if (!response.ok)
      throw new Error("Failed to start batch");
    return response.json();
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
