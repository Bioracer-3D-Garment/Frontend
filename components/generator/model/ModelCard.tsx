import { Typography } from "@mui/material";
import { Check } from "@mui/icons-material";
import type { Model } from "@/types/types";
import { CldImage } from "next-cloudinary";

interface ModelCardProps {
  model: Model;
  onToggle: (id: number) => void;
}

export default function ModelCard({ model, onToggle }: ModelCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(model.id)}
      className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-[1.4rem] border p-4 text-left transition-all duration-200 ${
        model.selected
          ? "border-[#e2001a] bg-white shadow-[0_10px_24px_rgba(226,0,26,0.08)] ring-1 ring-[#e2001a]/15"
          : "border-gray-100 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
      }`}
      aria-pressed={model.selected}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

      <div className="absolute right-4 top-4 z-10 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold capitalize text-red-600 shadow-sm">
        {model.gender}
      </div>

      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5">
        <img
          src={
            process.env.NEXT_PUBLIC_PYTHON_SERVER_URL +
            "/" +
            model.profilePicture
          }
          alt={model.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="min-w-0">
          <Typography
            variant="body1"
            className="truncate text-[1rem] font-semibold tracking-tight text-black"
          >
            {model.name}
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${model.selected ? "bg-[#e2001a]" : "bg-gray-300"}`}
          />
          <Typography variant="caption" className="text-gray-500">
            {model.selected ? "Selected" : "Tap to select"}
          </Typography>
        </div>
      </div>
    </button>
  );
}
