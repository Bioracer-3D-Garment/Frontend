export type GarmentCategory = "top" | "bottom";

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

export interface GeneratedAsset {
  id: number;
  projectId: number;
  jobId: string;
  productId: string;
  poseId: string;
  category: "upper_body" | "lower_body";
  secureUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  publicId: string;
}

export interface ProjectAssetsPage {
  projectId: number;
  totalCount: number;
  page: number;
  size: number;
  assets: GeneratedAsset[];
}

export interface BatchStatus {
  jobId: string;
  status: "PENDING" | "RUNNING" | "DONE" | "PARTIAL" | "FAILED";
  completed: number;
  total: number;
  uploadedCount: number;
  failedItems: { productId: string; poseId: string; reason: string }[];
  assets: GeneratedAsset[] | null;
}

export interface ModelPhotos {
  front: string;
  back: string;
  side: string;
}

export interface Model {
  id: number;
  name: string;
  profilePicture: string;
  gender: "male" | "female";
  selected: boolean;
  photos?: ModelPhotos;
  isCustom?: boolean;
}

export interface Asset {
  id: number;
  name: string;
  type: "image" | "video";
  size: string;
  date: string;
  clothing: string;
  model: string;
  thumbnail: string;
  secureUrl: string;
  projectId: number;
  publicId: string;
}

export interface ProjectUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Project {
  id?: number;
  name: string;
  coverImage: string;
  user?: ProjectUser;
}

export interface GeneratorStatus {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error";
}

export type Resolution = "1k" | "2k" | "4k";
export type FrameFormat = "portrait" | "square" | "landscape";
export type FrameOutputFormat = "png" | "jpeg";

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
  type: "success" | "error";
}

export type UserLoginResult =
  | { ok: true; message?: string }
  | { ok: false; message: string };

export interface GarmentError {
  garment: string;
  found: string[];
  missing: string[];
}

export interface ZipValidationError {
  status: number;
  error: string;
  message: string;
  garmentErrors: GarmentError[];
}

export interface UserLoginCredentials {
  email: string;
  password: string;
}
