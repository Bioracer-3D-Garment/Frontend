import { type MouseEvent } from 'react';
import { Typography, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import type { FolderData } from '@/types/types';

interface FolderGridProps {
  folders: FolderData[];
  onOpenFolder: (folderId: string) => void;
  onEditFolder: (folderId: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export function FolderGrid({ folders, onOpenFolder, onEditFolder }: FolderGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {folders.map((folder) => (
        <div key={folder.id} className="group bg-white border border-gray-200 hover:border-black transition-all rounded overflow-hidden">
          <button onClick={() => onOpenFolder(folder.id)} className="relative aspect-square bg-gray-100 overflow-hidden w-full">
            <img src={folder.coverImage} alt={folder.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <IconButton
              onClick={(event) => onEditFolder(folder.id, event)}
              className="absolute top-2 right-2 bg-white opacity-0 transition-all hover:bg-[#e2001a] hover:text-white hover:scale-110 group-hover:opacity-100"
              size="small"
            >
              <Edit fontSize="small" />
            </IconButton>
          </button>
          <div className="p-4">
            <Typography variant="body2" className="font-bold text-black truncate">
              {folder.name}
            </Typography>
            <Typography variant="caption" className="text-gray-500 block mt-1">
              {folder.itemCount} item{folder.itemCount !== 1 ? 's' : ''}
            </Typography>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
              <span>Modified</span>
              <span>{folder.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}