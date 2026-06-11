import { postForJobId } from "@/service/http/jobClient";

interface VideoSubmitParams {
  imageJobId: string;
  productId: string;
  folderId: number;
  durationSeconds?: number;
  prompt?: string;
}

class VideoService {
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
