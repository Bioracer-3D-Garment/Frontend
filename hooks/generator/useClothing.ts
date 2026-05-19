import { useState, type ChangeEvent } from 'react';
import type { ClothingItem } from '@/types/types';
import { revokePreviewIfBlob } from '@/utils/preview';

export function useClothing() {
	const [clothing, setClothing] = useState<ClothingItem[]>([]);

	const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const newItems: ClothingItem[] = Array.from(files).map((file, index) => ({
				id: Date.now() + index,
				name: file.name.replace(/\.[^/.]+$/, ''),
				file,
				preview: URL.createObjectURL(file),
			}));

			setClothing((currentClothing) => [...currentClothing, ...newItems]);
		}
	};

	const removeClothing = (id: number) => {
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
