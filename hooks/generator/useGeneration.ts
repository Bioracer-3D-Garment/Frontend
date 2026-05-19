import { useState } from 'react';
import { useRouter } from 'next/router';
import type { GeneratorStatus } from '@/types/types';

interface UseGenerationParams {
	clothingCount: number;
	selectedModels: number;
	selectedFolderName: string;
	selectedFolderId: string;
}

export function useGeneration({ clothingCount, selectedModels, selectedFolderName, selectedFolderId }: UseGenerationParams) {
	const router = useRouter();
	const [generating, setGenerating] = useState(false);
	const [status, setStatus] = useState<GeneratorStatus>({
		open: false,
		message: '',
		severity: 'success',
	});

	const canGenerate = clothingCount > 0 && selectedModels > 0 && selectedFolderId !== '';

	const handleGenerate = () => {
		const totalAssets = clothingCount * selectedModels;
		setGenerating(true);
		setStatus({ open: true, message: `Rendering ${totalAssets} asset${totalAssets !== 1 ? 's' : ''}…`, severity: 'info' });

		setTimeout(() => {
			setGenerating(false);
			setStatus({
				open: true,
				message: `${totalAssets} asset${totalAssets !== 1 ? 's' : ''} generated successfully in "${selectedFolderName || 'folder'}". Click here to view.`,
				severity: 'success',
			});
		}, 2000);
	};

	const handleSnackbarClick = () => {
		if (status.severity === 'success') {
			router.push('/assets');
		}
	};

	const closeStatus = () => setStatus((currentStatus) => ({ ...currentStatus, open: false }));

	return {
		generating,
		canGenerate,
		handleGenerate,
		status,
		closeStatus,
		handleSnackbarClick,
	};
}
