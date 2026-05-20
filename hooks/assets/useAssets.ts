import { useMemo, useState } from 'react';
import type { Asset } from '@/types/types';

export function useAssets(selectedProjectId: number | null) {
	const [assets] = useState<Asset[]>([]);
	const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');

	const projectAssets = useMemo(
		() => (selectedProjectId ? assets.filter((asset) => asset.projectId === selectedProjectId) : []),
		[assets, selectedProjectId]
	);

	const filteredAssets = useMemo(
		() => (filter === 'all' ? projectAssets : projectAssets.filter((asset) => asset.type === filter)),
		[projectAssets, filter]
	);

	const filters = useMemo(
		(): { key: typeof filter; label: string; count: number }[] => [
			{ key: 'all', label: 'All', count: projectAssets.length },
			{ key: 'image', label: 'Images', count: projectAssets.filter((asset) => asset.type === 'image').length },
			{ key: 'video', label: 'Videos', count: projectAssets.filter((asset) => asset.type === 'video').length },
		],
		[projectAssets]
	);

	return {
		assets,
		filter,
		setFilter,
		filteredAssets,
		filters,
	};
}
