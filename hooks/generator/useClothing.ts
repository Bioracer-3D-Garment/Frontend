import { useState, type ChangeEvent } from 'react';

export function useClothing() {
  const [zipFile, setZipFile] = useState<File | null>(null);

  const handleZipUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setZipFile(file);
    event.target.value = '';
  };

  return { zipFile, handleZipUpload };
}
