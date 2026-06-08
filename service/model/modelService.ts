import { getJwtToken } from "@/service/auth/auth_service";
import type { Model } from "@/types/types";

interface BackendModel {
  id: number;
  name: string;
  gender: "MALE" | "FEMALE" | "X";
  front: string;
  back: string;
  side: string;
  coverImage?: string;
}

type BackendModelRequest = Omit<BackendModel, "id">;

function fromBackendGender(
  g: "MALE" | "FEMALE" | "X",
): "male" | "female" {
  return g === "MALE" ? "male" : "female";
}

function toBackendGender(
  g: "male" | "female",
): "MALE" | "FEMALE" {
  return g === "male" ? "MALE" : "FEMALE";
}

function toFrontend(model: BackendModel): Model {
  return {
    id: model.id,
    name: model.name,
    gender: fromBackendGender(model.gender),
    profilePicture: model.coverImage ?? model.front,
    photos: {
      front: model.front,
      back: model.back,
      side: model.side,
    },
    selected: false,
    isCustom: true,
  };
}

function toBackend(
  model: Omit<Model, "id" | "selected">,
): BackendModelRequest {
  const profileIsCustom =
    model.profilePicture &&
    model.profilePicture !== model.photos?.front;
  return {
    name: model.name,
    gender: toBackendGender(model.gender),
    front: model.photos!.front,
    back: model.photos!.back,
    side: model.photos!.side,
    ...(profileIsCustom
      ? { coverImage: model.profilePicture }
      : {}),
  };
}

class ModelService {
  private getAuthHeaders(
    json = false,
  ): Record<string, string> {
    const token = getJwtToken();
    if (!token) throw new Error("JWT token is not set");
    return {
      Authorization: `Bearer ${token}`,
      ...(json
        ? { "Content-Type": "application/json" }
        : {}),
    };
  }

  async getModels(): Promise<Model[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/model`,
      {
        headers: this.getAuthHeaders(),
      },
    );
    if (!response.ok)
      throw new Error("Failed to fetch models");
    const data: BackendModel[] = await response.json();
    return data.map((m) => toFrontend(m));
  }

  async createModel(
    model: Omit<Model, "id" | "selected">,
  ): Promise<number> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/model`,
      {
        method: "POST",
        headers: this.getAuthHeaders(true),
        body: JSON.stringify(toBackend(model)),
      },
    );
    if (!response.ok)
      throw new Error("Failed to create model");
    const created: BackendModel = await response.json();
    return created.id;
  }

  async updateModel(
    id: number,
    model: Omit<Model, "id" | "selected">,
  ): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/model/${id}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(true),
        body: JSON.stringify(toBackend(model)),
      },
    );
    if (!response.ok)
      throw new Error("Failed to update model");
  }

  async deleteModel(id: number): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/model/${id}`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      },
    );
    if (!response.ok)
      throw new Error("Failed to delete model");
  }
}

export default new ModelService();
