import { getJwtToken } from '@/service/auth/auth_service';
import type { ProjectAssetsPage } from '@/types/types';

interface GetProjectAssetsParams {
  jobId?: string;
  category?: string;
  page?: number;
  size?: number;
}

class AssetService {
  private getAuthHeaders(): Record<string, string> {
    const token = getJwtToken();
    if (!token) throw new Error('JWT token is not set');
    return { Authorization: `Bearer ${token}` };
  }

  async getProjectAssets(projectId: number, params?: GetProjectAssetsParams): Promise<ProjectAssetsPage> {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/assets`);
    if (params?.jobId) url.searchParams.set('jobId', params.jobId);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.page !== undefined) url.searchParams.set('page', String(params.page));
    if (params?.size !== undefined) url.searchParams.set('size', String(params.size));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch project assets');
    return response.json();
  }

  async deleteAsset(assetId: number): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/assets/${assetId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok && response.status !== 204) throw new Error('Failed to delete asset');
  }

  async downloadProjectAssets(projectId: number, projectName: string): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/assets/download`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to download project assets');
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `${projectName}.zip`;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}

export default AssetService;
