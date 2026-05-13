import { Typography } from '@mui/material';
import { Check } from '@mui/icons-material';
import type { Model } from '@/types/types';
import { SectionHeader } from '../SectionHeader';

interface ModelSelectionSectionProps {
  models: Model[];
  subtitle: string;
  onToggleModel: (id: string) => void;
}

export function ModelSelectionSection({ models, subtitle, onToggleModel }: ModelSelectionSectionProps) {
  return (
    <section>
      <SectionHeader step="03" title="Select Models" subtitle={subtitle} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onToggleModel(model.id)}
            className={`group flex items-center gap-4 bg-white border text-left transition-all rounded overflow-hidden ${
              model.selected ? 'border-[#e2001a] ring-1 ring-[#e2001a] shadow-sm' : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="relative w-20 h-20 shrink-0 bg-gray-100 overflow-hidden">
              <img src={model.photo} alt={model.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 py-3 pr-4 min-w-0">
              <Typography variant="body1" className="font-bold text-black truncate">
                {model.name}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {model.gender} · {model.bodyType} · {model.height}
              </Typography>
            </div>
            <div
              className={`mr-4 w-6 h-6 rounded-full flex items-center justify-center border-2 transition ${
                model.selected ? 'bg-[#e2001a] border-[#e2001a]' : 'border-gray-300 group-hover:border-gray-500'
              }`}
            >
              {model.selected && <Check className="text-white text-[16px]" />}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}