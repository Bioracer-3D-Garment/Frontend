import React from 'react';
import { TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { GenerationOptions } from '@/types/types';

interface AdvancedSettingsProps {
  options: GenerationOptions;
  onChange: (opts: GenerationOptions) => void;
}

export function AdvancedSettings({ options, onChange }: AdvancedSettingsProps) {
  const handleResolution = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (!value) return;
    onChange({ ...options, resolution: value });
  };

  const handleFrameFormat = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (!value) return;
    onChange({ ...options, frameFormat: value });
  };

  const handleOutputFormat = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (!value) return;
    onChange({ ...options, frameOutputFormat: value });
  };

  const buttonClasses =
    'min-h-12 flex-1 border-0 px-5 py-3 text-sm font-semibold normal-case tracking-wide text-gray-500 transition-colors hover:bg-gray-50 [&.Mui-selected]:!bg-[#e2001a] [&.Mui-selected]:!text-white [&.Mui-selected:hover]:!bg-[#b80015]';

  const groupClasses = 'w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm';

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Output resolution</h3>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={options.resolution}
            onChange={handleResolution}
            className={groupClasses}
            sx={{
              '& .MuiToggleButton-root': {
                border: 0,
                borderRadius: 0,
              },
              '& .MuiToggleButton-root + .MuiToggleButton-root': {
                borderLeft: '1px solid rgb(229 231 235)',
              },
            }}
          >
            <ToggleButton value="1k" className={buttonClasses}>1K</ToggleButton>
            <ToggleButton value="2k" className={buttonClasses}>2K</ToggleButton>
            <ToggleButton value="4k" className={buttonClasses}>4K</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Frame format</h3>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={options.frameFormat}
            onChange={handleFrameFormat}
            className={groupClasses}
            sx={{
              '& .MuiToggleButton-root': {
                border: 0,
                borderRadius: 0,
              },
              '& .MuiToggleButton-root + .MuiToggleButton-root': {
                borderLeft: '1px solid rgb(229 231 235)',
              },
            }}
          >
            <ToggleButton value="portrait" className={buttonClasses}>Portrait</ToggleButton>
            <ToggleButton value="square" className={buttonClasses}>Square</ToggleButton>
            <ToggleButton value="landscape" className={buttonClasses}>Landscape</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Output format</h3>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={options.frameOutputFormat}
            onChange={handleOutputFormat}
            className={groupClasses}
            sx={{
              '& .MuiToggleButton-root': {
                border: 0,
                borderRadius: 0,
              },
              '& .MuiToggleButton-root + .MuiToggleButton-root': {
                borderLeft: '1px solid rgb(229 231 235)',
              },
            }}
          >
            <ToggleButton value="png" className={buttonClasses}>PNG</ToggleButton>
            <ToggleButton value="jpeg" className={buttonClasses}>JPEG</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Prompt</h3>
        <TextField
          placeholder="A professional cycling athlete wearing the outfit, photographed in a modern studio with clean white background, dramatic side lighting, sharp focus, photorealistic quality."
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
          value={options.prompt ?? ''}
          onChange={(e) => onChange({ ...options, prompt: e.target.value })}
          className="bg-white"
          inputProps={{ 'aria-label': 'generation prompt' }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '0.75rem',
              backgroundColor: 'white',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgb(229 231 235)',
            },
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgb(209 213 219)',
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e2001a',
              borderWidth: '1px',
            },
          }}
        />
        <p className="text-xs text-gray-400 mt-2">Edit or extend the default prompt to refine the fit on the model. Pre-configured poses and lighting are applied on top.</p>
      </div>
    </div>
  );
}

export default AdvancedSettings;
