import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import type { ClothingItem, GeneratorStatus } from '@/types/types';
import BatchService from '@/service/batch/batchService';
import AssetService from '@/service/asset/assetService';
import { uploadToCloudinary } from '@/utils/cloudinary';

const batchService = new BatchService();
const assetService = new AssetService();
const POLL_INTERVAL_MS = 3000;

interface UseGenerationParams {
	clothing: ClothingItem[];
	selectedGender: string | null;
	selectedProjectName: string;
	selectedProjectId: number | null;
}

export function useGeneration({ clothing, selectedGender, selectedProjectName, selectedProjectId }: UseGenerationParams) {
	const router = useRouter();
	const [generating, setGenerating] = useState(false);
	const [progress, setProgress] = useState({ completed: 0, total: 0 });
	const [status, setStatus] = useState<GeneratorStatus>({ open: false, message: '', severity: 'info' });
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const canGenerate = clothing.length > 0 && selectedGender !== null && selectedProjectId !== null;

	const stopPolling = () => {
		if (pollRef.current) {
			clearInterval(pollRef.current);
			pollRef.current = null;
		}
	};

	const saveGeneratedAssets = async (jobId: string) => {
		const images = await batchService.getBatchImages(jobId);
		const clothingLabel = clothing.map((c) => c.name).join(', ');

		await Promise.all(
			images.map(async ({ name, file }) => {
				const cloudinaryUrl = await uploadToCloudinary(file);
				await assetService.createProjectAsset(selectedProjectId!, {
					name,
					type: 'image',
					thumbnail: cloudinaryUrl,
					clothing: clothingLabel,
					model: selectedGender!,
				});
			})
		);

		return images.length;
	};

	const handleGenerate = async () => {
		setGenerating(true);
		setProgress({ completed: 0, total: 0 });
		setStatus({ open: true, message: 'Starting batch…', severity: 'info' });

		const formData = new FormData();
		clothing.forEach((item) => {
			formData.append('garmentFiles', item.file);
			formData.append('garmentNames', item.name);
			formData.append('garmentCategories', item.category);
		});
		formData.append('gender', selectedGender!);
		formData.append('folderId', String(selectedProjectId));

		let jobId: string;
		try {
			const result = await batchService.startBatch(formData);
			jobId = result.jobId;
		} catch {
			setGenerating(false);
			setStatus({ open: true, message: 'Failed to start batch. Please try again.', severity: 'error' });
			return;
		}

		setStatus({ open: true, message: `Generating ${clothing.length} item${clothing.length !== 1 ? 's' : ''} with ${selectedGender} model…`, severity: 'info' });

		pollRef.current = setInterval(async () => {
			try {
				const batchStatus = await batchService.getBatchStatus(jobId);
				setProgress({ completed: batchStatus.completed, total: batchStatus.total });

				if (batchStatus.status === 'DONE') {
					stopPolling();
					setStatus({ open: true, message: 'Saving results to your library…', severity: 'info' });

					try {
						const savedCount = await saveGeneratedAssets(jobId);
						setGenerating(false);
						setStatus({
							open: true,
							message: `${savedCount} asset${savedCount !== 1 ? 's' : ''} generated in "${selectedProjectName}". Click to view.`,
							severity: 'success',
						});
					} catch {
						setGenerating(false);
						setStatus({
							open: true,
							message: 'Generation succeeded but failed to save assets to your library. Please try again.',
							severity: 'error',
						});
					}

					setProgress({ completed: 0, total: 0 });
				} else if (batchStatus.status === 'FAILED') {
					stopPolling();
					setGenerating(false);
					const failCount = batchStatus.failedItems.length;
					setStatus({
						open: true,
						message: `Batch failed: ${failCount} combination${failCount !== 1 ? 's' : ''} could not be generated after retries.`,
						severity: 'error',
					});
					setProgress({ completed: 0, total: 0 });
				}
			} catch {
				stopPolling();
				setGenerating(false);
				setStatus({ open: true, message: 'Lost connection while checking batch progress.', severity: 'error' });
				setProgress({ completed: 0, total: 0 });
			}
		}, POLL_INTERVAL_MS);
	};

	const handleSnackbarClick = () => {
		if (status.severity === 'success' && selectedProjectId !== null) {
			router.push(`/assets?project=${selectedProjectId}`);
		}
	};

	const closeStatus = () => setStatus((s) => ({ ...s, open: false }));

	return { generating, progress, canGenerate, handleGenerate, status, closeStatus, handleSnackbarClick };
}
