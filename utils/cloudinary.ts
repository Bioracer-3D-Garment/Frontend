import { getJwtToken } from '@/service/auth/auth_service';

// Direct Cloudinary upload is not permitted from the frontend.
// All Cloudinary interactions are handled exclusively by the backend.
// Images are uploaded through the backend `POST /upload` endpoint, which returns
// the Cloudinary public ID / URLs that we persist (e.g. as a model's pose images).

export interface UploadResult {
  secureUrl: string;
  publicId: string;
  thumbnailUrl: string;
}

/**
 * Uploads a single image file to Cloudinary via the backend `/upload` endpoint.
 * Returns the Cloudinary public ID and delivery URLs.
 */
export async function uploadImage(file: File): Promise<UploadResult> {
  const token = getJwtToken();
  if (!token) throw new Error('JWT token is not set');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || 'Failed to upload image');
  }

  return response.json();
}
