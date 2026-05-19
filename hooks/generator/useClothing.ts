import { useState, type ChangeEvent } from 'react';
import type { ClothingItem } from '@/types/types';
import { revokePreviewIfBlob } from '@/utils/preview';

export function useClothing() {
	const [clothing, setClothing] = useState<ClothingItem[]>([]);

	const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const newItems: ClothingItem[] = Array.from(files).map((file) => ({
				id: `${Date.now()}-${Math.random()}`,
				name: file.name.replace(/\.[^/.]+$/, ''),
				file,
				preview: URL.createObjectURL(file),
			}));

			setClothing((currentClothing) => [...currentClothing, ...newItems]);
		}
	};

	const removeClothing = (id: string) => {
		setClothing((currentClothing) => {
			const item = currentClothing.find((clothingItem) => clothingItem.id === id);

			if (item) {
				revokePreviewIfBlob(item.preview);
			}

			return currentClothing.filter((clothingItem) => clothingItem.id !== id);
		});
	};

	return {
		clothing,
		handleFileUpload,
		removeClothing,
	};
}
