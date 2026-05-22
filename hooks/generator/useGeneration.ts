import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import type { ClothingItem, GeneratorStatus } from '@/types/types';
import BatchService from '@/service/batch/batchService';

const batchService = new BatchService();
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
					setGenerating(false);
					await batchService.downloadBatch(jobId);
					setStatus({
						open: true,
						message: `${batchStatus.completed} asset${batchStatus.completed !== 1 ? 's' : ''} generated in "${selectedProjectName}". Click to view.`,
						severity: 'success',
					});
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
		if (status.severity === 'success') {
			router.push('/assets');
		}
	};

	const closeStatus = () => setStatus((s) => ({ ...s, open: false }));

	return { generating, progress, canGenerate, handleGenerate, status, closeStatus, handleSnackbarClick };
}
