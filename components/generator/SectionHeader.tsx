import { Typography } from '@mui/material';

interface SectionHeaderProps {
  step: string;
  title: string;
  subtitle: string;
}

export function SectionHeader({ step, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-5 pb-3 border-b border-gray-200">
      <div className="flex items-baseline gap-4">
        <span className="text-[#e2001a] font-extrabold tracking-widest">{step}</span>
        <Typography variant="h5" className="font-extrabold text-black">
          {title}
        </Typography>
      </div>
      <Typography variant="caption" className="text-gray-500 tracking-widest uppercase">
        {subtitle}
      </Typography>
    </div>
  );
}