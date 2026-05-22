import { Skeleton } from '@mui/material';
import type { PoseOption } from '@/types/types';
import { SectionHeader } from '../SectionHeader';
import { PoseCard } from './PoseCard';

interface PoseSelectionSectionProps {
  poses: PoseOption[];
  loading: boolean;
  subtitle: string;
  onSelectGender: (id: string) => void;
}

export function PoseSelectionSection({ poses, loading, subtitle, onSelectGender }: PoseSelectionSectionProps) {
  return (
    <section>
      <SectionHeader step="03" title="Select Model" subtitle={subtitle} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" className="!rounded-[1.4rem]" sx={{ aspectRatio: '3/4', width: '100%', height: 'auto' }} />
            ))
          : poses.map((pose) => (
              <PoseCard key={pose.id} pose={pose} onToggle={onSelectGender} />
            ))}
      </div>
    </section>
  );
}
