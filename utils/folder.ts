import type { FolderData } from '@/types/types';

export function createFolder(name: string): FolderData {
	return {
		id: crypto.randomUUID(),
		name,
		date: new Date().toISOString().split('T')[0],
		itemCount: 0,
		coverImage: '',
	};
}
