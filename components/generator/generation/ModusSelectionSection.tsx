import React from "react";
import { Checkbox } from "@mui/material";
import AdvancedSettings from "./AdvancedSettings";
import VideoSettings from "./VideoSettings";
import { SectionHeader } from "../SectionHeader";
import type {
  Resolution,
  FrameOutputFormat,
  VideoOptions,
} from "@/types/types";

interface PhotoValues {
  resolution: Resolution;
  frameOutputFormat: FrameOutputFormat;
  prompt?: string;
}

interface ModeSelectionSectionProps {
  photoValues: PhotoValues;
  onPhotoChange: (patch: Partial<PhotoValues>) => void;
  videoValues: VideoOptions;
  onVideoChange: (patch: Partial<VideoOptions>) => void;
}

export function ModusSelectionSection({
  photoValues,
  onPhotoChange,
  videoValues,
  onVideoChange,
}: ModeSelectionSectionProps) {
  return (
    <section>
      <SectionHeader
        step="04"
        title="Settings"
        subtitle={videoValues.enabled ? "Photo + Video" : "Photo only"}
      />

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e2001a]">
              Photo
            </p>
          </div>
          <div className="px-6 py-6">
            <AdvancedSettings values={photoValues} onChange={onPhotoChange} />
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e2001a]">
                Video
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {videoValues.enabled ? "Enabled" : "Disabled"}
              </span>
              <Checkbox
                checked={videoValues.enabled}
                onChange={(e) => onVideoChange({ enabled: e.target.checked })}
                inputProps={{
                  "aria-label": "enable video generation",
                }}
                sx={{
                  color: "rgb(209 213 219)",
                  "&.Mui-checked": { color: "#e2001a" },
                }}
              />
            </div>
          </label>
          <div className="px-6 py-6">
            <VideoSettings values={videoValues} onChange={onVideoChange} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ModusSelectionSection;
