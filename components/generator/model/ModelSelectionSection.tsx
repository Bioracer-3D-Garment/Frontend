import type { Model } from '@/types/types';
import { SectionHeader } from '../SectionHeader';
import ModelCard from './ModelCard';

interface ModelSelectionSectionProps {
  models: Model[];
  subtitle: string;
  onToggleModel: (id: number) => void;
}

export function ModelSelectionSection({ models, subtitle, onToggleModel }: ModelSelectionSectionProps) {
  return (
    <section>
      <SectionHeader step="03" title="Select Models" subtitle={subtitle} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} onToggle={onToggleModel} />
        ))}
      </div>
    </section>
  );
}