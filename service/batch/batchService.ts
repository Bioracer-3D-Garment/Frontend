import JSZip from 'jszip';
import { getJwtToken } from '@/service/auth/auth_service';
import type { BatchStatus } from '@/types/types';

class BatchService {
  private getAuthHeaders(): Record<string, string> {
    const token = getJwtToken();
    if (!token) throw new Error('JWT token is not set');
    return { Authorization: `Bearer ${token}` };
  }

  async startBatch(formData: FormData): Promise<{ jobId: string }> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/batches`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to start batch');
    return response.json();
  }

  async getBatchStatus(jobId: string): Promise<BatchStatus> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/batches/${jobId}/status`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get batch status');
    return response.json();
  }

  async getBatchImages(jobId: string): Promise<{ name: string; file: File }[]> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/batches/${jobId}/download`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to download batch results');

    const zipBlob = await response.blob();
    const zip = await JSZip.loadAsync(zipBlob);

    const entries = Object.entries(zip.files).filter(([, entry]) => !entry.dir);

    const files = await Promise.all(
      entries.map(async ([path, entry]) => {
        const blob = await entry.async('blob');
        const name = path.split('/').pop() ?? path;
        return { name, file: new File([blob], name, { type: blob.type || 'image/jpeg' }) };
      })
    );

    return files;
  }
}

export default BatchService;
