import { useState, type ChangeEvent } from 'react';

export function useClothing() {
  const [frontDesign, setFrontDesign] = useState<File | null>(null);
  const [backDesign, setBackDesign] = useState<File | null>(null);

  const handleFrontUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFrontDesign(file);
    event.target.value = '';
  };

  const handleBackUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setBackDesign(file);
    event.target.value = '';
  };

  return { frontDesign, backDesign, handleFrontUpload, handleBackUpload };
}
