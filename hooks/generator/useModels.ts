import { useState } from 'react';
import type { Model } from '@/types/types';
import { gaelleModel } from './models/gaelle';
import { patrickModel } from './models/patrick';

const initialModels: Model[] = [patrickModel, gaelleModel];

export function useModels() {
  const [models, setModels] = useState<Model[]>(initialModels);

  const toggleModel = (id: number) => {
    setModels((current) => {
      const target = current.find((m) => m.id === id);
      if (!target) return current;

      const selectedModels = current.filter((m) => m.selected);
      const activeGender = selectedModels[0]?.gender;

      // Block if opposite gender is already selected
      if (!target.selected && activeGender && target.gender !== activeGender) {
        return current;
      }

      return current.map((model) =>
        model.id === id ? { ...model, selected: !model.selected } : model
      );
    });
  };

  const addModel = (model: Omit<Model, 'id' | 'selected'>) => {
    setModels((current) => [
      ...current,
      { ...model, id: Date.now(), selected: false, isCustom: true },
    ]);
  };

  const updateModel = (id: number, updates: Partial<Omit<Model, 'id'>>) => {
    setModels((current) =>
      current.map((model) => (model.id === id ? { ...model, ...updates } : model))
    );
  };

  const deleteModel = (id: number) => {
    setModels((current) => current.filter((model) => model.id !== id));
  };

  const selectedModels = models.filter((m) => m.selected);
  const selectedGender = selectedModels[0]?.gender ?? null;

  return { models, selectedModels, selectedGender, toggleModel, addModel, updateModel, deleteModel };
}
