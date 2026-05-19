import { useState } from 'react';
import type { Model } from '@/types/types';
import { gaelleModel } from './models/gaelle';
import { patrickModel } from './models/patrick';

const initialModels: Model[] = [patrickModel, gaelleModel];

export function useModels() {
  const [models, setModels] = useState<Model[]>(initialModels);

  const toggleModelSelection = (id: number) => {
    setModels((currentModels) =>
      currentModels.map((model) => (model.id === id ? { ...model, selected: !model.selected } : model))
    );
  };

  const selectedModels = models.filter((model) => model.selected).length;

  return {
    models,
    selectedModels,
    toggleModelSelection,
  };
}
