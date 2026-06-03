import { getJwtToken } from "@/service/auth/auth_service";
import type {
  BatchStatus,
  GarmentError,
  Resolution,
  FrameOutputFormat,
} from "@/types/types";

interface AdvancedSettings {
  prompt?: string;
  resolution?: Resolution;
  frameFormat?: FrameFormat;
  frameOutputFormat?: FrameOutputFormat;
}

interface BatchSubmitParams {
  frontDesign: File;
  backDesign: File;
  modelId: number;
  folderId: number;
  advancedSettings?: AdvancedSettings;
}

class BatchService {
  private getAuthHeaders(): Record<string, string> {
    const token = getJwtToken();
    if (!token) throw new Error("JWT token is not set");
    return { Authorization: `Bearer ${token}` };
  }

  async startBatch({ frontDesign, backDesign, modelId, folderId, advancedSettings = {} }: BatchSubmitParams): Promise<{ jobId: string }> {
    const formData = new FormData();

    formData.append('frontDesign', frontDesign);
    formData.append('backDesign', backDesign);
    formData.append('modelId', String(modelId));
    formData.append('folderId', String(folderId));

    // Map to the backend AdvancedSettings schema exactly: { resolution, outputFormat, prompt }.
    // Note: the backend has no field for `frameFormat`, so it is intentionally not sent.
    const advancedSettingsPayload = {
      resolution: advancedSettings.resolution,
      outputFormat: advancedSettings.frameOutputFormat,
      prompt: advancedSettings.prompt,
    };
    const AdvancedSettingsJson = new Blob([JSON.stringify(advancedSettingsPayload)], {
      type: 'application/json',
    });
    formData.append('advancedSettings', AdvancedSettingsJson);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/batches`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (response.status === 400) {
      const body = await response.json().catch(() => ({}));
      if (Array.isArray(body.garmentErrors) && body.garmentErrors.length > 0) {
        const issues = (body.garmentErrors as GarmentError[])
          .map((e) => `${e.garment}: missing ${e.missing.join(', ')}`)
          .join('; ');
        throw new Error(`Validation failed — ${issues}`);
      }
      throw new Error(body.message ?? "Invalid request");
    }

    if (!response.ok) throw new Error('Failed to start batch');

    // The backend may respond with either JSON ({ jobId }) or a plain-text
    // confirmation ("Job has been accepted: <jobId>"). Handle both robustly.
    const raw = await response.text();

    try {
      const parsed = JSON.parse(raw) as { jobId?: string };
      if (parsed.jobId) return { jobId: parsed.jobId };
    } catch {
      // Not JSON — fall through to plain-text parsing below.
    }

    const match = raw.match(/Job has been accepted:\s*(\S+)/);
    if (match) return { jobId: match[1] };

    throw new Error('Batch started but no job ID was returned');
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