import { type ChangeEvent } from 'react';
import { Typography } from '@mui/material';
import { CloudUpload, Image } from '@mui/icons-material';
import { SectionHeader } from '../SectionHeader';

interface UploadZoneProps {
  label: string;
  inputId: string;
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function UploadZone({ label, inputId, file, onChange }: UploadZoneProps) {
  return (
    <div className="flex-1 min-w-0">
      <Typography variant="caption" className="font-bold text-gray-500 uppercase tracking-wider mb-2 block">
        {label}
      </Typography>

      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
        id={inputId}
      />

      {!file ? (
        <label htmlFor={inputId}>
          <div className="border-2 border-dashed border-gray-300 bg-white hover:border-[#e2001a] hover:bg-red-50/30 transition-colors cursor-pointer py-12 flex flex-col items-center text-center rounded">
            <CloudUpload className="text-gray-400 mb-2 text-[48px]" />
            <Typography variant="body2" className="font-bold text-black">
              Click to browse
            </Typography>
            <Typography variant="caption" className="text-gray-500 mt-0.5">
              JPG or PNG
            </Typography>
          </div>
        </label>
      ) : (
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded px-4 py-3">
          <Image className="text-[#e2001a] text-[32px] shrink-0" />
          <div className="flex-1 min-w-0">
            <Typography variant="body2" className="font-bold text-black truncate">
              {file.name}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {(file.size / 1024).toFixed(0)} KB
            </Typography>
          </div>
          <label
            htmlFor={inputId}
            className="shrink-0 text-sm font-bold tracking-wider text-gray-500 hover:text-[#e2001a] cursor-pointer transition-colors"
          >
            CHANGE
          </label>
        </div>
      )}
    </div>
  );
}

interface ClothingUploadSectionProps {
  frontDesign: File | null;
  backDesign: File | null;
  onFrontUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onBackUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function ClothingUploadSection({
  frontDesign,
  backDesign,
  onFrontUpload,
  onBackUpload,
}: ClothingUploadSectionProps) {
  const uploadedCount = (frontDesign ? 1 : 0) + (backDesign ? 1 : 0);
  const subtitle = uploadedCount === 0
    ? 'No images selected'
    : uploadedCount === 1
    ? '1 of 2 images selected'
    : 'Front and back designs ready';

  return (
    <section>
      <SectionHeader step="02" title="Upload Garment Designs" subtitle={subtitle} />

      <div className="flex gap-4">
        <UploadZone
          label="Front Design"
          inputId="upload-garment-front"
          file={frontDesign}
          onChange={onFrontUpload}
        />
        <UploadZone
          label="Back Design"
          inputId="upload-garment-back"
          file={backDesign}
          onChange={onBackUpload}
        />
      </div>
    </section>
  );
}
