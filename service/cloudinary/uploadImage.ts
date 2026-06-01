import { getJwtToken } from '@/service/auth/auth_service';

export async function uploadImage(file: File): Promise<string> {
  const token = getJwtToken();
  if (!token) throw new Error('JWT token is not set');

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to upload image');
  const data = await response.json();
  return data.secureUrl as string;
}
