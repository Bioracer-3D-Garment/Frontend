import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import type { GeneratorStatus, GeneratedAsset, Resolution, FrameFormat, FrameOutputFormat } from '@/types/types';
import BatchService from '@/service/batch/batchService';

const batchService = new BatchService();
const POLL_INTERVAL_MS = 5000;

interface UseGenerationParams {
	zipFile: File | null;
	selectedGender: string | null;
	selectedProjectName: string;
	selectedProjectId: number | null;
}

export function useGeneration({ zipFile, selectedGender, selectedProjectName, selectedProjectId }: UseGenerationParams) {
	const router = useRouter();
	const [generating, setGenerating] = useState(false);
	const [progress, setProgress] = useState({ completed: 0, total: 0 });
	const [status, setStatus] = useState<GeneratorStatus>({ open: false, message: '', severity: 'info' });
	const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[] | null>(null);
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const canGenerate = zipFile !== null && selectedGender !== null && selectedProjectId !== null;

	const stopPolling = () => {
		if (pollRef.current) {
			clearInterval(pollRef.current);
			pollRef.current = null;
		}
	};

	const handleGenerate = async (options?: {
		resolution?: Resolution;
		frameFormat?: FrameFormat;
		frameOutputFormat?: FrameOutputFormat;
		prompt?: string;
	}) => {
		setGenerating(true);
		setGeneratedAssets(null);
		setProgress({ completed: 0, total: 0 });
		setStatus({ open: true, message: 'Starting batch…', severity: 'info' });

		let jobId: string;
		try {
				const result = await batchService.startBatch({
					garmentZip: zipFile!,
					gender: selectedGender!,
					folderId: selectedProjectId!,
					options,
				});
			jobId = result.jobId;
		} catch (err) {
			setGenerating(false);
			setStatus({
				open: true,
				message: err instanceof Error ? err.message : 'Failed to start batch. Please try again.',
				severity: 'error',
			});
			return;
		}

		setStatus({ open: true, message: `Generating "${zipFile!.name}" with ${selectedGender} model…`, severity: 'info' });

		pollRef.current = setInterval(async () => {
			try {
				const batchStatus = await batchService.getBatchStatus(jobId);
				setProgress({ completed: batchStatus.completed, total: batchStatus.total });

				if (batchStatus.status === 'DONE') {
					stopPolling();
					setGenerating(false);
					setGeneratedAssets(batchStatus.assets);
					setStatus({
						open: true,
						message: `${batchStatus.uploadedCount} asset${batchStatus.uploadedCount !== 1 ? 's' : ''} generated in "${selectedProjectName}". Click to view.`,
						severity: 'success',
					});
					setProgress({ completed: 0, total: 0 });
				} else if (batchStatus.status === 'PARTIAL') {
					stopPolling();
					setGenerating(false);
					setGeneratedAssets(batchStatus.assets);
					const failCount = batchStatus.failedItems.length;
					setStatus({
						open: true,
						message: `${batchStatus.uploadedCount} asset${batchStatus.uploadedCount !== 1 ? 's' : ''} generated with ${failCount} failure${failCount !== 1 ? 's' : ''}. Click to view.`,
						severity: 'warning',
					});
					setProgress({ completed: 0, total: 0 });
				} else if (batchStatus.status === 'FAILED') {
					stopPolling();
					setGenerating(false);
					const failCount = batchStatus.failedItems.length;
					setStatus({
						open: true,
						message: `Batch failed: ${failCount} combinations could not be generated after retries.`,
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
		if (status.severity === 'success' || status.severity === 'warning') {
			router.push(selectedProjectId ? `/assets?projectId=${selectedProjectId}` : '/assets');
		}
	};

	const closeStatus = () => setStatus((s) => ({ ...s, open: false }));

	return { generating, progress, canGenerate, handleGenerate, status, closeStatus, handleSnackbarClick, generatedAssets };
}
