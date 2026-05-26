import type { ProjectSavePayload } from '@/types/types';

export function buildProjectPayload(
	name: string,
	coverImage: string,
	galleryImages: string[] = [],
): ProjectSavePayload {
	return {
		name,
		coverImage,
		galleryImages,
	};
}
