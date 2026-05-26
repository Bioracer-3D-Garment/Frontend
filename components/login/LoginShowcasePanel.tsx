import { Typography } from '@mui/material';

export function LoginShowcasePanel() {
  return (
    <div className="relative hidden lg:block min-h-screen">
      <img
        src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1600&h=1800&fit=crop"
        alt="Cycling"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-12 left-12 right-12 text-white">
        <div className="inline-block bg-[#e2001a] px-3 py-1 mb-4 text-xs tracking-[0.2em] font-bold">
          BIORACER STUDIO
        </div>
        <Typography variant="h4" className="font-extrabold leading-snug">
          Generate imagery with AI.
        </Typography>
      </div>
    </div>
  );
}