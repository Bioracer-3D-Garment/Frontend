import type { Project } from '@/types/types';

export function createProject(name: string): Project {
	return {
		id: Date.now() + Math.floor(Math.random() * 10000),
		name,
		date: new Date().toISOString().split('T')[0],
		itemCount: 0,
		coverImage: '',
	};
}
