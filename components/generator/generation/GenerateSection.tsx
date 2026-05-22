import { Button, LinearProgress, Typography } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

interface GenerateSectionProps {
  clothingCount: number;
  selectedGender: string;
  selectedProjectName: string;
  generating: boolean;
  progress: { completed: number; total: number };
  canGenerate: boolean;
  onGenerate: () => void;
}

export function GenerateSection({
  clothingCount,
  selectedGender,
  selectedProjectName,
  generating,
  progress,
  canGenerate,
  onGenerate,
}: GenerateSectionProps) {
  const progressValue = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <section className="bg-black text-white rounded relative overflow-hidden">
      {generating && (
        <LinearProgress
          variant={progress.total > 0 ? 'determinate' : 'indeterminate'}
          value={progress.total > 0 ? progressValue : undefined}
          className="absolute inset-x-0 top-0 !bg-[rgba(255,255,255,0.1)] [&_.MuiLinearProgress-bar]:!bg-[#e2001a]"
        />
      )}
      <div className="px-10 py-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-8 h-0.75 bg-[#e2001a]" />
            <Typography variant="overline" className="text-[#e2001a] font-bold tracking-[0.2em]">
              STEP 04 · GENERATE
            </Typography>
          </div>
          <Typography variant="h4" className="font-extrabold mb-1">
            {canGenerate
              ? 'Ready when you are.'
              : selectedProjectName === ''
              ? 'Select a project first.'
              : 'Add clothing and select a model gender.'}
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            {generating && progress.total > 0
              ? `${progress.completed} / ${progress.total} generated…`
              : `${clothingCount} clothing item${clothingCount !== 1 ? 's' : ''} · ${selectedGender || 'no model selected'} · saves to "${selectedProjectName || 'select a project'}" · optimized lighting and camera angles applied automatically.`}
          </Typography>
        </div>
        <Button
          variant="contained"
          size="large"
          disabled={!canGenerate || generating}
          onClick={onGenerate}
          startIcon={<AutoAwesome />}
          disableElevation
          className="!font-bold !tracking-widest !px-8 !py-3 !bg-[#b80015] !text-white !shadow-none transition-all enabled:hover:!bg-[#e2001a] enabled:hover:scale-[1.04] enabled:hover:!shadow-[0_10px_24px_rgba(226,0,26,0.35)] disabled:!bg-[#1f1f1f] disabled:!text-gray-400 disabled:!opacity-100 [&_.MuiButton-startIcon]:!text-current [&_.MuiButton-startIcon_.MuiSvgIcon-root]:!text-current"
        >
          {generating ? 'GENERATING…' : 'GENERATE ASSETS'}
        </Button>
      </div>
    </section>
  );
}
