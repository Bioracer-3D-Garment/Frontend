import React from "react";
import { Slider, TextField } from "@mui/material";
import type { VideoOptions } from "@/types/types";

const MIN_DURATION = 3;
const MAX_DURATION = 15;

interface VideoSettingsProps {
  values: VideoOptions;
  onChange: (patch: Partial<VideoOptions>) => void;
}

export function VideoSettings({
  values,
  onChange,
}: VideoSettingsProps) {
  const disabled = !values.enabled;

  return (
    <div
      className={`space-y-6 transition-opacity ${
        disabled
          ? "pointer-events-none select-none opacity-40"
          : "opacity-100"
      }`}
      aria-disabled={disabled}
    >
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            Clip duration
          </h3>
          <span className="text-sm font-semibold text-gray-700">
            {values.durationSeconds}s
          </span>
        </div>
        <div className="px-1">
          <Slider
            disabled={disabled}
            value={values.durationSeconds}
            onChange={(_, value) =>
              onChange({
                durationSeconds: Array.isArray(value)
                  ? value[0]
                  : value,
              })
            }
            min={MIN_DURATION}
            max={MAX_DURATION}
            step={1}
            marks
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}s`}
            aria-label="video clip duration in seconds"
            sx={{
              color: "#e2001a",
              "& .MuiSlider-rail": {
                color: "rgb(229 231 235)",
                opacity: 1,
              },
              "& .MuiSlider-mark": {
                color: "rgb(209 213 219)",
              },
              "& .MuiSlider-markActive": {
                color: "white",
              },
            }}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{MIN_DURATION}s</span>
            <span>{MAX_DURATION}s</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
          Motion prompt
        </h3>
        <TextField
          placeholder="Model slowly rotates 180° from front to back, subtle fabric movement, cinematic studio lighting."
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
          disabled={disabled}
          value={values.prompt ?? ""}
          onChange={(e) => onChange({ prompt: e.target.value })}
          className="bg-white"
          inputProps={{ "aria-label": "video motion prompt" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.75rem",
              backgroundColor: "white",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgb(229 231 235)",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "rgb(209 213 219)",
              },
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e2001a",
              borderWidth: "1px",
            },
          }}
        />
        <p className="text-xs text-gray-400 mt-2">
          Optional. Describe how the model and camera should
          move. The generated studio images are used as start
          and end frames.
        </p>
      </div>
    </div>
  );
}

export default VideoSettings;
