import { getJwtToken } from "@/service/auth/auth_service";

export interface UploadResult {
  secureUrl: string;
  publicId: string;
  thumbnailUrl: string;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const token = getJwtToken();
  if (!token) throw new Error("JWT token is not set");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${baseUrl}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Failed to upload image");
  }

  return response.json();
}
