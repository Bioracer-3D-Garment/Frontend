import { useState, type ChangeEvent } from 'react';
import type { ClothingItem, GarmentCategory } from '@/types/types';
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
        category: 'top',
      }));

      setClothing((current) => [...current, ...newItems]);
    }
  };

  const removeClothing = (id: number) => {
    setClothing((current) => {
      const item = current.find((c) => c.id === id);
      if (item) revokePreviewIfBlob(item.preview);
      return current.filter((c) => c.id !== id);
    });
  };

  const toggleCategory = (id: number) => {
    setClothing((current) =>
      current.map((item): ClothingItem => {
        if (item.id !== id) return item;
        const next: GarmentCategory = item.category === 'top' ? 'bottom' : 'top';
        return { ...item, category: next };
      })
    );
  };

  return { clothing, handleFileUpload, removeClothing, toggleCategory };
}
