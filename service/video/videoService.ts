import { getJwtToken } from "@/service/auth/auth_service";

interface VideoSubmitParams {
  /** The image-generation batch jobId whose front/back/side try-on assets to animate. */
  imageJobId: string;
  /** Which product within that job to animate (matches the generated assets' productId). */
  productId: string;
  folderId: number;
  /** Desired clip length in seconds (3–15); omit to use the backend default. */
  durationSeconds?: number;
  /** Optional creative prompt; omit to use the default turntable prompt. */
  prompt?: string;
}

class VideoService {
  private getAuthHeaders(): Record<string, string> {
    const token = getJwtToken();
    if (!token) throw new Error("JWT token is not set");
    return { Authorization: `Bearer ${token}` };
  }

  /**
   * Submits a turntable video job (fal.ai Kling). The video runs async and is tracked through the
   * shared batch-job machinery, so poll progress via BatchService.getBatchStatus(jobId). The
   * finished video lands in the project's assets with poseId="video".
   */
  async startVideo(
    params: VideoSubmitParams,
  ): Promise<{ jobId: string }> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/videos`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageJobId: params.imageJobId,
        productId: params.productId,
        folderId: params.folderId,
        durationSeconds: params.durationSeconds ?? null,
        prompt:
          params.prompt && params.prompt.trim()
            ? params.prompt
            : null,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || "Failed to start video");
    }

    // Body looks like: "Video job has been accepted: <jobId>"
    const text = await response.text();
    const jobId = text.split(": ").pop()?.trim();
    if (!jobId) throw new Error("Invalid response from server");
    return { jobId };
  }
}

export default VideoService;
