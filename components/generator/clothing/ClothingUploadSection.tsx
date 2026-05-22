import { type ChangeEvent } from 'react';
import { Typography } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import type { ClothingItem } from '@/types/types';
import { SectionHeader } from '../SectionHeader';

interface ClothingUploadSectionProps {
  clothing: ClothingItem[];
  subtitle: string;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: number) => void;
  onToggleCategory: (id: number) => void;
}

export function ClothingUploadSection({ clothing, subtitle, onFileUpload, onRemove, onToggleCategory }: ClothingUploadSectionProps) {
  return (
    <section>
      <SectionHeader step="02" title="Upload Clothing" subtitle={subtitle} />

      <input
        type="file"
        multiple
        onChange={onFileUpload}
        className="hidden"
        id="upload-clothing"
        accept=".obj,.fbx,.glb,.png,.jpg,.jpeg"
      />

      {clothing.length === 0 ? (
        <label htmlFor="upload-clothing">
          <div className="border-2 border-dashed border-gray-300 bg-white hover:border-[#e2001a] hover:bg-red-50/30 transition-colors cursor-pointer py-20 flex flex-col items-center text-center rounded">
            <CloudUpload className="text-gray-400 mb-2 text-[56px]" />
            <Typography variant="h6" className="font-bold text-black">
              Drop files here or click to browse
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              Supports OBJ, FBX, GLB, PNG, JPG · up to 50 MB per file
            </Typography>
          </div>
        </label>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {clothing.map((item) => (
            <div key={item.id} className="group relative bg-white border border-gray-200 hover:border-black transition-colors rounded overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {item.file.type.startsWith('image/') ? (
                  <img src={item.preview} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 font-bold tracking-widest">3D</span>
                )}
              </div>

              <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between gap-2">
                <Typography variant="caption" className="font-semibold text-black truncate flex-1">
                  {item.name}
                </Typography>
                <button
                  type="button"
                  onClick={() => onToggleCategory(item.id)}
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase transition-colors ${
                    item.category === 'top'
                      ? 'bg-[#e2001a] text-white'
                      : 'bg-black text-white'
                  }`}
                >
                  {item.category === 'top' ? 'Top' : 'Bottom'}
                </button>
              </div>

              <button
                onClick={() => onRemove(item.id)}
                className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full p-1 opacity-0 group-hover:opacity-100 transition hover:border-[#e2001a] hover:text-[#e2001a]"
              >
                <Close fontSize="small" />
              </button>
            </div>
          ))}

          <label htmlFor="upload-clothing">
            <div className="aspect-square border-2 border-dashed border-gray-300 hover:border-[#e2001a] hover:bg-red-50/30 transition-colors cursor-pointer flex flex-col items-center justify-center rounded">
              <CloudUpload className="text-gray-400 mb-1 text-[32px]" />
              <Typography variant="caption" className="font-semibold text-gray-500">
                Add more
              </Typography>
            </div>
          </label>
        </div>
      )}
    </section>
  );
}
