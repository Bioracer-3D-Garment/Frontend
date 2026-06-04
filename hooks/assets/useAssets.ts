import { useState, useEffect, useMemo } from "react";
import type { Asset, GeneratedAsset } from "@/types/types";
import AssetService from "@/service/asset/assetService";

const assetService = new AssetService();

function toAsset(ga: GeneratedAsset): Asset {
  return {
    id: ga.id,
    name: `${ga.productId} · ${ga.poseId}`,
    type: ga.poseId === "video" ? "video" : "image",
    size: "",
    date: ga.createdAt,
    clothing: ga.productId,
    model: ga.poseId,
    thumbnail: ga.thumbnailUrl,
    secureUrl: ga.secureUrl,
    projectId: ga.projectId,
    publicId: ga.publicId,
  };
}

export function useAssets(selectedProjectId: number | null) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedProjectId) {
      setAssets([]);
      return;
    }
    setLoading(true);
    setError("");
    assetService
      .getProjectAssets(selectedProjectId)
      .then((page) => setAssets(page.assets.map(toAsset)))
      .catch(() => setError("Failed to load assets."))
      .finally(() => setLoading(false));
  }, [selectedProjectId]);

  const deleteAsset = async (id: number) => {
    await assetService.deleteAsset(id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAssets = useMemo(
    () =>
      filter === "all"
        ? assets
        : assets.filter((asset) => asset.type === filter),
    [assets, filter],
  );

  const filters = useMemo(
    (): { key: typeof filter; label: string; count: number }[] => [
      { key: "all", label: "All", count: assets.length },
      {
        key: "image",
        label: "Images",
        count: assets.filter((a) => a.type === "image").length,
      },
      {
        key: "video",
        label: "Videos",
        count: assets.filter((a) => a.type === "video").length,
      },
    ],
    [assets],
  );

  return {
    assets,
    filter,
    setFilter,
    filteredAssets,
    filters,
    loading,
    error,
    deleteAsset,
  };
}
