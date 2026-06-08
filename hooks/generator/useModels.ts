import { useState, useEffect } from 'react';
import type { Model } from '@/types/types';
import modelService from '@/service/model/modelService';

export function useModels() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async (preserveSelected?: number[]) => {
    try {
      const fresh = await modelService.getModels();
      setModels(
        preserveSelected
          ? fresh.map((m) => ({ ...m, selected: preserveSelected.includes(m.id) }))
          : fresh,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load models');
    }
  };

  useEffect(() => {
    fetchModels().finally(() => setLoading(false));
  }, []);

  const toggleModel = (id: number) => {
    setModels((current) => {
      const target = current.find((m) => m.id === id);
      if (!target) return current;
      const selectedModels = current.filter((m) => m.selected);
      const activeGender = selectedModels[0]?.gender;
      if (!target.selected && activeGender && target.gender !== activeGender) {
        return current;
      }
      return current.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m));
    });
  };

  const addModel = async (model: Omit<Model, 'id' | 'selected'>): Promise<number> => {
    const newId = await modelService.createModel(model);
    const selectedIds = models.filter((m) => m.selected).map((m) => m.id);
    await fetchModels(selectedIds);
    return newId;
  };

  const updateModel = async (id: number, updates: Partial<Omit<Model, 'id'>>) => {
    const current = models.find((m) => m.id === id);
    if (!current) return;
    const merged: Omit<Model, 'id' | 'selected'> = { ...current, ...updates };
    setModels((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    try {
      await modelService.updateModel(id, merged);
    } catch (err) {
      const selectedIds = models.filter((m) => m.selected).map((m) => m.id);
      await fetchModels(selectedIds);
      throw err;
    }
  };

  const deleteModel = async (id: number) => {
    const snapshot = models;
    setModels((prev) => prev.filter((m) => m.id !== id));
    try {
      await modelService.deleteModel(id);
    } catch (err) {
      setModels(snapshot);
      throw err;
    }
  };

  const selectedModels = models.filter((m) => m.selected);
  const selectedGender = selectedModels[0]?.gender ?? null;

  return {
    models,
    loading,
    error,
    selectedModels,
    selectedGender,
    toggleModel,
    addModel,
    updateModel,
    deleteModel,
  };
}
