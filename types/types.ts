export interface ClothingItem {
  id: string;
  name: string;
  file: File;
  preview: string;
}

export interface Model {
  id: string;
  name: string;
  bodyType: string;
  gender: string;
  height: string;
  photo: string;
  selected: boolean;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video';
  size: string;
  date: string;
  clothing: string;
  model: string;
  thumbnail: string;
  folderId: string;
}

export interface FolderData {
  id: string;
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
  folderId: string | null;
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
