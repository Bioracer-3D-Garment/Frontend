import { useEffect, useMemo, useState } from 'react';
import type { Asset } from '@/types/types';
import AssetService from '@/service/asset/assetService';

const defaultAssetService = new AssetService();

export function useAssets(selectedProjectId: number | null, assetService = defaultAssetService) {
	const [assets, setAssets] = useState<Asset[]>([]);
	const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
	const [loadingAssets, setLoadingAssets] = useState(false);
	const [assetError, setAssetError] = useState('');

	useEffect(() => {
		if (!selectedProjectId) {
			setAssets([]);
			return;
		}
		setLoadingAssets(true);
		setAssetError('');
		assetService
			.getProjectAssets(selectedProjectId)
			.then(setAssets)
			.catch(() => setAssetError('Failed to load assets.'))
			.finally(() => setLoadingAssets(false));
	}, [selectedProjectId]);

	const filteredAssets = useMemo(
		() => (filter === 'all' ? assets : assets.filter((asset) => asset.type === filter)),
		[assets, filter]
	);

	const filters = useMemo(
		(): { key: typeof filter; label: string; count: number }[] => [
			{ key: 'all', label: 'All', count: assets.length },
			{ key: 'image', label: 'Images', count: assets.filter((asset) => asset.type === 'image').length },
			{ key: 'video', label: 'Videos', count: assets.filter((asset) => asset.type === 'video').length },
		],
		[assets]
	);

	return {
		assets,
		filter,
		setFilter,
		filteredAssets,
		filters,
		loadingAssets,
		assetError,
	};
}
