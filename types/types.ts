export type GarmentCategory = 'top' | 'bottom';

export interface ClothingItem {
  id: number;
  name: string;
  file: File;
  preview: string;
  category: GarmentCategory;
}

export interface PoseOption {
  id: string;
  label: string;
  thumbnailUrl: string;
  selected: boolean;
}

export interface BatchStatus {
  jobId: string;
  status: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED';
  completed: number;
  total: number;
  failedItems: { productId: string; poseId: string; reason: string }[];
}

export interface Model {
  id: number;
  name: string;
  profilePicture: string;
  gender: 'male' | 'female';
  selected: boolean;
}

export interface Asset {
  id: number;
  name: string;
  type: 'image' | 'video';
  size: string;
  date: string;
  clothing: string;
  model: string;
  thumbnail: string;
  projectId: number;
}

export interface Project {
  id: number;
  name: string;
  date: string;
  itemCount: number;
  coverImage: string;
  galleryImages: string[];
}

export interface ProjectSavePayload {
  name: string;
  coverImage: string;
  galleryImages: string[];
}

export interface CreateAssetPayload {
  name: string;
  type: 'image';
  thumbnail: string;
  clothing: string;
  model: string;
}

export interface GeneratorStatus {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'error';
}

export interface EditProjectDialogState {
  open: boolean;
  projectId: number | null;
}

export interface User {
  email: string;
  password: string;
}

export interface StatusMessage {
  message: string;
  type: 'success' | 'error';
}

export type UserLoginResult = { ok: true; message?: string } | { ok: false; message: string };

export interface UserLoginCredentials {
  email: string;
  password: string;
}
