import { getJwtToken } from '@/service/auth/auth_service';
import type { Model } from '@/types/types';

/**
 * Shape returned by the backend ModelController. The image fields
 * (coverImage / front / back / side) hold Cloudinary public IDs.
 */
interface BackendModel {
  id: number;
  name: string;
  coverImage: string | null;
  front: string;
  back: string;
  side: string;
  gender: 'MALE' | 'FEMALE';
}

/** Domain input used when creating or updating a model. Image fields are Cloudinary public IDs. */
export interface ModelSaveInput {
  name: string;
  gender: 'male' | 'female';
  coverImage: string;
  front: string;
  back: string;
  side: string;
}

function toFrontendModel(backend: BackendModel): Model {
  const front = backend.front;
  return {
    id: backend.id,
    name: backend.name,
    gender: backend.gender === 'MALE' ? 'male' : 'female',
    // Fall back to the front pose when no dedicated cover image is set.
    profilePicture: backend.coverImage && backend.coverImage.length > 0 ? backend.coverImage : front,
    photos: { front, back: backend.back, side: backend.side },
    selected: false,
    isCustom: true,
  };
}

function toRequestBody(input: ModelSaveInput) {
  return {
    name: input.name,
    coverImage: input.coverImage,
    front: input.front,
    back: input.back,
    side: input.side,
    gender: input.gender === 'male' ? 'MALE' : 'FEMALE',
  };
}

class ModelService {
  private getAuthHeaders(): Record<string, string> {
    const token = getJwtToken();
    if (!token) throw new Error('JWT token is not set');
    return { Authorization: `Bearer ${token}` };
  }

  private get baseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL ?? '';
  }

  async getModels(): Promise<Model[]> {
    const response = await fetch(`${this.baseUrl}/model`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch models');
    const data: BackendModel[] = await response.json();
    return data.map(toFrontendModel);
  }

  async createModel(input: ModelSaveInput): Promise<Model> {
    const response = await fetch(`${this.baseUrl}/model`, {
      method: 'POST',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(toRequestBody(input)),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || 'Failed to create model');
    }
    return toFrontendModel(await response.json());
  }

  async updateModel(id: number, input: ModelSaveInput): Promise<Model> {
    const response = await fetch(`${this.baseUrl}/model/${id}`, {
      method: 'PUT',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(toRequestBody(input)),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || 'Failed to update model');
    }
    return toFrontendModel(await response.json());
  }

  async deleteModel(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/model/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok && response.status !== 204) throw new Error('Failed to delete model');
  }
}

export default ModelService;
