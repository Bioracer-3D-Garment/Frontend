import { Typography, IconButton } from '@mui/material';
import { Download, PlayArrow, Image as ImageIcon } from '@mui/icons-material';
import type { Asset } from '@/types/types';

interface AssetGridProps {
  assets: Asset[];
}

export function AssetGrid({ assets }: AssetGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assets.map((asset) => (
        <div key={asset.id} className="group bg-white border border-gray-200 hover:border-black transition-all rounded overflow-hidden">
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
            <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              {asset.type}
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <IconButton className="bg-white hover:bg-[#e2001a] hover:text-white">
                {asset.type === 'video' ? <PlayArrow /> : <ImageIcon />}
              </IconButton>
              <IconButton className="bg-white hover:bg-[#e2001a] hover:text-white">
                <Download />
              </IconButton>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <Typography variant="body2" className="font-bold text-black truncate">
              {asset.name}
            </Typography>
            <Typography variant="caption" className="text-gray-500 block">
              {asset.clothing} · {asset.model}
            </Typography>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
              <span>{asset.date}</span>
              <span>{asset.size}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}