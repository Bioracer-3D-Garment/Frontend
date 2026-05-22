import { useState } from 'react';
import type { Model } from '@/types/types';
import { gaelleModel } from './models/gaelle';
import { patrickModel } from './models/patrick';

const initialModels: Model[] = [patrickModel, gaelleModel];

export function useModels() {
  const [models, setModels] = useState<Model[]>(initialModels);

  const selectModel = (id: number) => {
    setModels((current) =>
      current.map((model) => ({ ...model, selected: model.id === id }))
    );
  };

  const selectedModel = models.find((m) => m.selected);
  const selectedGender = selectedModel?.gender ?? null;

  return { models, selectedModel, selectedGender, selectModel };
}
