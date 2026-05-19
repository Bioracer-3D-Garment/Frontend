export interface ClothingItem {
  id: number
  name: string;
  file: File;
  preview: string;
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
  folderId: number;
}

export interface FolderData {
  id: number;
  name: string;
  date: string;
  itemCount: number;
  coverImage: string;
}

export type Folder = FolderData;

export interface GeneratorStatus {
  open: boolean;
  message: string;
  severity: 'success' | 'info';
}

export interface EditFolderDialogState {
  open: boolean;
  folderId: number | null;
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
