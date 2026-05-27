import { type ChangeEvent } from 'react';
import { Typography } from '@mui/material';
import { CloudUpload, FolderZip } from '@mui/icons-material';
import { SectionHeader } from '../SectionHeader';

interface ClothingUploadSectionProps {
  zipFile: File | null;
  onZipUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function ClothingUploadSection({ zipFile, onZipUpload }: ClothingUploadSectionProps) {
  const subtitle = zipFile
    ? `${zipFile.name} · ${(zipFile.size / 1024 / 1024).toFixed(1)} MB`
    : 'No ZIP selected';

  return (
    <section>
      <SectionHeader step="02" title="Upload Garments" subtitle={subtitle} />

      <input
        type="file"
        accept=".zip"
        onChange={onZipUpload}
        className="hidden"
        id="upload-garment-zip"
      />

      {!zipFile ? (
        <label htmlFor="upload-garment-zip">
          <div className="border-2 border-dashed border-gray-300 bg-white hover:border-[#e2001a] hover:bg-red-50/30 transition-colors cursor-pointer py-16 flex flex-col items-center text-center rounded">
            <CloudUpload className="text-gray-400 mb-2 text-[56px]" />
            <Typography variant="h6" className="font-bold text-black">
              Drop ZIP here or click to browse
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              ZIP must contain one subfolder per garment, each with <code>front.jpg</code>, <code>back.jpg</code>, <code>side.jpg</code>
            </Typography>
          </div>
        </label>
      ) : (
        <div className="flex items-center gap-4 bg-white border border-gray-200 rounded px-5 py-4">
          <FolderZip className="text-[#e2001a] text-[40px] shrink-0" />
          <div className="flex-1 min-w-0">
            <Typography variant="body2" className="font-bold text-black truncate">
              {zipFile.name}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {(zipFile.size / 1024 / 1024).toFixed(1)} MB
            </Typography>
          </div>
          <label
            htmlFor="upload-garment-zip"
            className="shrink-0 text-sm font-bold tracking-wider text-gray-500 hover:text-[#e2001a] cursor-pointer transition-colors"
          >
            CHANGE
          </label>
        </div>
      )}
    </section>
  );
}
