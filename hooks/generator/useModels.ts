import { useCallback, useEffect, useState } from 'react';
import type { Model, ModelFormValues } from '@/types/types';
import ModelService, { type ModelSaveInput } from '@/service/model/modelService';

const modelService = new ModelService();

function toSaveInput(values: ModelFormValues): ModelSaveInput {
  return {
    name: values.name,
    gender: values.gender,
    coverImage: values.profilePicture,
    front: values.photos.front,
    back: values.photos.back,
    side: values.photos.side,
  };
}

export function useModels() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Promise-chain style (not async/await) so state updates only happen inside the
  // async callbacks — avoids the react-hooks/set-state-in-effect lint rule when called
  // from the mount effect below (mirrors the usePoses hook).
  const loadModels = useCallback(() => {
    return modelService
      .getModels()
      .then((fetched) => {
        // Preserve any client-side selection across reloads.
        setModels((current) => {
          const selectedIds = new Set(current.filter((m) => m.selected).map((m) => m.id));
          return fetched.map((m) => ({ ...m, selected: selectedIds.has(m.id) }));
        });
        setError(null);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed to load models');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

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

  const addModel = async (values: ModelFormValues) => {
    const created = await modelService.createModel(toSaveInput(values));
    setModels((current) => [...current, created]);
  };

  const updateModel = async (id: number, values: ModelFormValues) => {
    const updated = await modelService.updateModel(id, toSaveInput(values));
    setModels((current) =>
      current.map((model) => (model.id === id ? { ...updated, selected: model.selected } : model))
    );
  };

  const deleteModel = async (id: number) => {
    await modelService.deleteModel(id);
    setModels((current) => current.filter((model) => model.id !== id));
  };

  const selectedModels = models.filter((m) => m.selected);
  const selectedGender = selectedModels[0]?.gender ?? null;

  return {
    models,
    loading,
    error,
    selectedModels,
    selectedGender,
    reloadModels: loadModels,
    toggleModel,
    addModel,
    updateModel,
    deleteModel,
  };
}
