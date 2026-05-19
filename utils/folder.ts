import type { FolderData } from '@/types/types';

export function createFolder(name: string): FolderData {
	return {
		id: Date.now() + Math.floor(Math.random() * 10000),
		name,
		date: new Date().toISOString().split('T')[0],
		itemCount: 0,
		coverImage: '',
	};
}
