import { type ChangeEvent } from 'react';
import { Typography } from '@mui/material';
import { CloudUpload, Image } from '@mui/icons-material';
import { SectionHeader } from '../SectionHeader';

interface ClothingUploadSectionProps {
  frontDesign: File | null;
  backDesign: File | null;
  onFrontUpload: (file: File) => void;
  onBackUpload: (file: File) => void;
}

function DesignUploader({
  id,
  label,
  file,
  onUpload,
}: {
  id: string;
  label: string;
  file: File | null;
  onUpload: (file: File) => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onUpload(selected);
  };

  return (
    <div className="flex-1">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id={id}
      />

      {!file ? (
        <label htmlFor={id}>
          <div className="border-2 border-dashed border-gray-300 bg-white hover:border-[#e2001a] hover:bg-red-50/30 transition-colors cursor-pointer py-12 flex flex-col items-center text-center rounded">
            <CloudUpload className="text-gray-400 mb-2 text-[48px]" />
            <Typography variant="body1" className="font-bold text-black">
              {label}
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              JPG, PNG or WEBP
            </Typography>
          </div>
        </label>
      ) : (
        <div className="flex items-center gap-4 bg-white border border-gray-200 rounded px-5 py-4">
          <Image className="text-[#e2001a] text-[40px] shrink-0" />
          <div className="flex-1 min-w-0">
            <Typography variant="body2" className="font-bold text-black truncate">
              {file.name}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </div>
          <label
            htmlFor={id}
            className="shrink-0 text-sm font-bold tracking-wider text-gray-500 hover:text-[#e2001a] cursor-pointer transition-colors"
          >
            CHANGE
          </label>
        </div>
      )}
    </div>
  );
}

export function ClothingUploadSection({ frontDesign, backDesign, onFrontUpload, onBackUpload }: ClothingUploadSectionProps) {
  const subtitle = frontDesign && backDesign
    ? `${frontDesign.name} · ${backDesign.name}`
    : frontDesign
    ? `Front uploaded — back missing`
    : backDesign
    ? `Back uploaded — front missing`
    : 'No designs uploaded';

  return (
    <section>
      <SectionHeader step="02" title="Upload Garment Designs" subtitle={subtitle} />
      <div className="flex gap-4">
        <DesignUploader
          id="upload-front-design"
          label="Drop front design here or click to browse"
          file={frontDesign}
          onUpload={onFrontUpload}
        />
        <DesignUploader
          id="upload-back-design"
          label="Drop back design here or click to browse"
          file={backDesign}
          onUpload={onBackUpload}
        />
      </div>
    </section>
  );
}