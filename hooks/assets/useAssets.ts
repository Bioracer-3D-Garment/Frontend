import { useMemo, useState } from 'react';
import type { Asset } from '@/types/types';

export function useAssets(selectedFolderId: number | null) {
	const [assets] = useState<Asset[]>([]);
	const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');

	const folderAssets = useMemo(
		() => (selectedFolderId ? assets.filter((asset) => asset.folderId === selectedFolderId) : []),
		[assets, selectedFolderId]
	);

	const filteredAssets = useMemo(
		() => (filter === 'all' ? folderAssets : folderAssets.filter((asset) => asset.type === filter)),
		[folderAssets, filter]
	);

	const filters = useMemo(
		(): { key: typeof filter; label: string; count: number }[] => [
			{ key: 'all', label: 'All', count: folderAssets.length },
			{ key: 'image', label: 'Images', count: folderAssets.filter((asset) => asset.type === 'image').length },
			{ key: 'video', label: 'Videos', count: folderAssets.filter((asset) => asset.type === 'video').length },
		],
		[folderAssets]
	);

	return {
		assets,
		filter,
		setFilter,
		filteredAssets,
		filters,
	};
}
