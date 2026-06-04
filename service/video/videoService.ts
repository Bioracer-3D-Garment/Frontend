import { postForJobId } from "@/service/http/jobClient";

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
  /**
   * Submits a turntable video job (fal.ai Kling v3 Pro). The video runs async and is tracked
   * through the shared batch-job machinery, so poll progress via BatchService.getBatchStatus(jobId).
   * The finished video lands in the project's assets with poseId="video".
   */
  startVideo(params: VideoSubmitParams): Promise<{ jobId: string }> {
    const body = JSON.stringify({
      imageJobId: params.imageJobId,
      productId: params.productId,
      folderId: params.folderId,
      durationSeconds: params.durationSeconds ?? null,
      prompt: params.prompt?.trim() ? params.prompt : null,
    });

    return postForJobId(
      "/videos",
      body,
      { "Content-Type": "application/json" },
      "Failed to start video",
    );
  }
}

export default VideoService;
