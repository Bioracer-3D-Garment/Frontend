import { getJwtToken } from "@/service/auth/auth_service";

type UploadPose = "front" | "back" | "side" | "coverImage";

export async function uploadImage(
  file: File,
  pose: UploadPose,
  modelId?: string | number,
): Promise<string> {
  const token = getJwtToken();
  if (!token) throw new Error("JWT token is not set");

  const formData = new FormData();
  formData.append("file", file);

  const searchParams = new URLSearchParams();
  searchParams.append("pose", pose);
  if (modelId !== undefined && modelId !== null) {
    searchParams.append("modelId", String(modelId));
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/upload/model/poses?${searchParams.toString()}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );

  if (!response.ok) throw new Error("Failed to upload image");
  const data = await response.json();
  // Return the Cloudinary public ID (e.g. "model_3_front"), not the secure URL.
  // The model's front/back/side fields must hold public IDs so the generation
  // pipeline (CloudinaryService.download) and <CldImage> can resolve them.
  return data.publicId as string;
}
