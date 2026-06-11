import { Typography } from "@mui/material";

export function LoginShowcasePanel() {
  return (
    <div className="relative hidden lg:block">
      <img
        src="https://www2.bioracer.com/wp-content/uploads/2024/08/Homepage-Banner-Remco-BOIC-2.webp"
        alt="Cycling"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-12 left-12 right-12 text-white"></div>
    </div>
  );
}
