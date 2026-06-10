import { useState } from "react";
import { Typography, IconButton } from "@mui/material";
import { Download, Delete, ZoomIn } from "@mui/icons-material";
import type { Asset } from "@/types/types";
import { AssetPreviewDialog } from "./AssetPreviewDialog";

interface AssetGridProps {
  assets: Asset[];
  onDelete?: (id: number) => void;
}

function groupByGarment(assets: Asset[]): Map<string, Asset[]> {
  const map = new Map<string, Asset[]>();
  for (const asset of assets) {
    const group = map.get(asset.clothing) ?? [];
    group.push(asset);
    map.set(asset.clothing, group);
  }
  return map;
}

export function AssetGrid({ assets, onDelete }: AssetGridProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const handleDownload = async (asset: Asset) => {
    const response = await fetch(asset.secureUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `${asset.clothing}_${asset.model}.${asset.type === "video" ? "mp4" : "jpg"}`;
    a.click();
    URL.revokeObjectURL(objectUrl);
  };

  const byGarment = groupByGarment(assets);

  if (byGarment.size === 0) {
    return (
      <div className="py-24 text-center text-gray-400">
        <Typography variant="body1">No assets in this project yet.</Typography>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-10">
      {[...byGarment.entries()].map(([garmentName, garmentAssets]) => (
        <div key={garmentName}>
          <div className="flex items-center gap-3 mb-4">
            <Typography
              variant="subtitle1"
              className="font-extrabold text-black tracking-wide uppercase"
            >
              {garmentName}
            </Typography>
            <span className="text-xs text-gray-400 font-semibold">
              {garmentAssets.length} view{garmentAssets.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {garmentAssets.map((asset) => (
              <div
                key={asset.id}
                className="group bg-white border border-gray-200 hover:border-black transition-all rounded overflow-hidden"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {asset.type === "video" ? (
                    <video
                      src={asset.secureUrl}
                      poster={asset.thumbnail || undefined}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        process.env.NEXT_PUBLIC_PYTHON_SERVER_URL +
                        "/files/" +
                        asset.publicId
                      }
                      alt={`${garmentName} ${asset.model}`}
                      onClick={() => setPreviewIndex(assets.indexOf(asset))}
                      className="w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-full capitalize tracking-wider">
                    {asset.model}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 pointer-events-none">
                    <IconButton
                      onClick={() => setPreviewIndex(assets.indexOf(asset))}
                      size="small"
                      aria-label="Preview asset"
                      className="!bg-white hover:!bg-[#e2001a] hover:!text-white !pointer-events-auto"
                    >
                      <ZoomIn fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDownload(asset)}
                      size="small"
                      aria-label="Download asset"
                      className="!bg-white hover:!bg-[#e2001a] hover:!text-white !pointer-events-auto"
                    >
                      <Download fontSize="small" />
                    </IconButton>
                    {onDelete && (
                      <IconButton
                        onClick={() => onDelete(asset.id)}
                        size="small"
                        aria-label="Delete asset"
                        className="!bg-white hover:!bg-[#b80015] hover:!text-white !pointer-events-auto"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </div>
                </div>
                <div className="px-3 py-2">
                  <Typography
                    variant="caption"
                    className="text-gray-500 capitalize"
                  >
                    {new Date(asset.date).toLocaleDateString()}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>

      <AssetPreviewDialog
        assets={assets}
        index={previewIndex}
        onClose={() => setPreviewIndex(null)}
        onNavigate={setPreviewIndex}
        onDownload={handleDownload}
      />
    </>
  );
}
