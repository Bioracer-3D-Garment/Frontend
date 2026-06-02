import React, { useState } from 'react';
import AdvancedSettings from './AdvancedSettings';
import type { Resolution, FrameFormat, FrameOutputFormat } from '@/types/types';
import { IconButton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

interface AdvancedSectionProps {
  values: {
    resolution: Resolution;
    frameFormat: FrameFormat;
    frameOutputFormat: FrameOutputFormat;
    prompt?: string;
  };
  onChange: (patch: Partial<{ resolution: Resolution; frameFormat: FrameFormat; frameOutputFormat: FrameOutputFormat; prompt?: string }>) => void;
}

export function AdvancedSection({ values, onChange }: AdvancedSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e2001a]">Advanced Settings</p>
          </div>
        </div>
        <IconButton size="small" onClick={() => setOpen((s) => !s)} aria-label={open ? 'Collapse advanced settings' : 'Expand advanced settings'}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>

      {open && (
        <div className="px-6 py-6">
          <AdvancedSettings values={values} onChange={(patch) => onChange(patch)} />
        </div>
      )}
    </section>
  );
}

export default AdvancedSection;
