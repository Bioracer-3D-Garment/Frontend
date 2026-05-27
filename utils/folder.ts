import type { Project } from '@/types/types';

export function createProject(name: string): Project {
	return {
		id: Date.now() + Math.floor(Math.random() * 10000),
		name,
		coverImage: '',
	};
}
