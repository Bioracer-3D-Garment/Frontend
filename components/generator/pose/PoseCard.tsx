import { Typography } from "@mui/material";
import { Check, Person } from "@mui/icons-material";
import type { PoseOption } from "@/types/types";

interface PoseCardProps {
  pose: PoseOption;
  onToggle: (id: string) => void;
}

export function PoseCard({ pose, onToggle }: PoseCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(pose.id)}
      aria-pressed={pose.selected}
      className={`group relative flex flex-col w-full overflow-hidden rounded-[1.4rem] border text-left transition-all duration-200 ${
        pose.selected
          ? "border-[#e2001a] bg-white shadow-[0_10px_24px_rgba(226,0,26,0.08)] ring-1 ring-[#e2001a]/15"
          : "border-gray-100 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

      {pose.selected && (
        <div className="absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#e2001a] shadow-sm">
          <Check sx={{ fontSize: 14 }} className="text-white" />
        </div>
      )}

      <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
        {pose.thumbnailUrl ? (
          <img
            src={pose.thumbnailUrl}
            alt={pose.label}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Person sx={{ fontSize: 64 }} className="text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <Typography variant="body2" className="font-semibold text-black">
          {pose.label}
        </Typography>
        <span
          className={`inline-flex h-2 w-2 rounded-full ${pose.selected ? "bg-[#e2001a]" : "bg-gray-300"}`}
        />
      </div>
    </button>
  );
}
