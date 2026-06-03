import React, { useEffect, useState } from "react";
import {
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

type Resolution = "1k" | "2k" | "4k";
type FrameOutputFormat = "png" | "jpeg";

interface AdvancedSettingsValues {
  resolution: Resolution;
  frameOutputFormat: FrameOutputFormat;
  prompt?: string | undefined;
}

interface AdvancedSettingsProps {
  values: AdvancedSettingsValues;
  onChange: (
    patch: Partial<AdvancedSettingsValues>,
  ) => void;
}

export function AdvancedSettings({
  values,
  onChange,
}: AdvancedSettingsProps) {
  const [resolution, setResolution] = useState<Resolution>(
    values.resolution,
  );
  const [frameOutputFormat, setFrameOutputFormat] =
    useState<FrameOutputFormat>(values.frameOutputFormat);
  const [prompt, setPrompt] = useState<string>(
    values.prompt ?? "",
  );

  useEffect(() => {
    setResolution(values.resolution);
    setFrameOutputFormat(values.frameOutputFormat);
    setPrompt(values.prompt ?? "");
  }, [values]);

  const buttonClasses =
    "min-h-12 flex-1 border-0 px-5 py-3 text-sm font-semibold normal-case tracking-wide text-gray-500 transition-colors hover:bg-gray-50 [&.Mui-selected]:!bg-[#e2001a] [&.Mui-selected]:!text-white [&.Mui-selected:hover]:!bg-[#b80015]";

  const groupClasses =
    "w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <h3 className="mb-2 flex min-h-8 items-end text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            Output resolution
          </h3>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={resolution}
            onChange={(
              _: React.MouseEvent<HTMLElement>,
              value: Resolution | null,
            ) => {
              if (!value) return;
              setResolution(value);
              onChange({ resolution: value });
            }}
            className={groupClasses}
            sx={{
              "& .MuiToggleButton-root": {
                border: 0,
                borderRadius: 0,
              },
              "& .MuiToggleButton-root + .MuiToggleButton-root":
                {
                  borderLeft: "1px solid rgb(229 231 235)",
                },
            }}
          >
            <ToggleButton
              value="1k"
              className={buttonClasses}
            >
              1K
            </ToggleButton>
            <ToggleButton
              value="2k"
              className={buttonClasses}
            >
              2K
            </ToggleButton>
            <ToggleButton
              value="4k"
              className={buttonClasses}
            >
              4K
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        {/* Frame format removed intentionally */}

        <div className="flex flex-col">
          <h3 className="mb-2 flex min-h-8 items-end text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            Output format
          </h3>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={frameOutputFormat}
            onChange={(
              _: React.MouseEvent<HTMLElement>,
              value: FrameOutputFormat | null,
            ) => {
              if (!value) return;
              setFrameOutputFormat(value);
              onChange({ frameOutputFormat: value });
            }}
            className={groupClasses}
            sx={{
              "& .MuiToggleButton-root": {
                border: 0,
                borderRadius: 0,
              },
              "& .MuiToggleButton-root + .MuiToggleButton-root":
                {
                  borderLeft: "1px solid rgb(229 231 235)",
                },
            }}
          >
            <ToggleButton
              value="png"
              className={buttonClasses}
            >
              PNG
            </ToggleButton>
            <ToggleButton
              value="jpeg"
              className={buttonClasses}
            >
              JPEG
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
          Prompt
        </h3>
        <TextField
          placeholder="A professional cycling athlete wearing the outfit, photographed in a modern studio with clean white background, dramatic side lighting, sharp focus, photorealistic quality."
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
          value={prompt ?? ""}
          onChange={(e) => {
            setPrompt(e.target.value);
            onChange({ prompt: e.target.value });
          }}
          className="bg-white"
          inputProps={{ "aria-label": "generation prompt" }}
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
            "& .Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#e2001a",
                borderWidth: "1px",
              },
          }}
        />
        <p className="text-xs text-gray-400 mt-2">
          Edit or extend the default prompt to refine the
          fit on the model. Pre-configured poses and
          lighting are applied on top.
        </p>
      </div>
    </div>
  );
}

export default AdvancedSettings;
