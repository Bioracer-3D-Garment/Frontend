import { useState } from 'react';
import { Add } from '@mui/icons-material';
import type { Model, ModelFormValues } from '@/types/types';
import { SectionHeader } from '../SectionHeader';
import ModelCard from './ModelCard';
import { ModelManagementModal } from './ModelManagementModal';

interface ModelSelectionSectionProps {
  models: Model[];
  loading?: boolean;
  selectedModels: Model[];
  subtitle: string;
  onToggleModel: (id: number) => void;
  onAddModel: (model: Omit<Model, 'id' | 'selected'>) => Promise<void>;
  onUpdateModel: (id: number, updates: Partial<Omit<Model, 'id'>>) => Promise<void>;
  onDeleteModel: (id: number) => Promise<void>;
}

export function ModelSelectionSection({
  models,
  loading,
  selectedModels,
  subtitle,
  onToggleModel,
  onAddModel,
  onUpdateModel,
  onDeleteModel,
}: ModelSelectionSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section>
      <SectionHeader step="03" title="Select Models" subtitle={loading ? 'Loading…' : subtitle} />

      {selectedModels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {selectedModels.map((model) => (
            <ModelCard key={model.id} model={model} onToggle={onToggleModel} />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 text-sm font-semibold text-gray-400 transition-all hover:border-[#e2001a]/40 hover:text-[#e2001a] w-full justify-center disabled:cursor-wait disabled:opacity-50"
      >
        <Add fontSize="small" />
        {selectedModels.length > 0 ? 'Change model' : 'Add model'}
      </button>

      <ModelManagementModal
        open={modalOpen}
        models={models}
        onClose={() => setModalOpen(false)}
        onToggle={onToggleModel}
        onAdd={onAddModel}
        onUpdate={onUpdateModel}
        onDelete={onDeleteModel}
      />
    </section>
  );
}
