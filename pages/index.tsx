import { useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { Navbar } from '@/components/Navbar';
import { useAuthRedirects } from '@/components/auth/useAuthRedirects';
import type { ClothingItem, GeneratorStatus, Model } from '@/types/types';
import { FolderSelectorSection } from '@/components/generator/folder/FolderSelectorSection';
import { ClothingUploadSection } from '@/components/generator/clothing/ClothingUploadSection';
import { ModelSelectionSection } from '@/components/generator/model/ModelSelectionSection';
import { GenerateSection } from '@/components/generator/generation/GenerateSection';
import { GenerationFeedback } from '@/components/generator/generation/GenerationFeedback';
import { NewFolderDialog } from '@/components/generator/folder/NewFolderDialog';

export default function GeneratorPage() {
	const router = useRouter();
	const { redirectToLogin } = useAuthRedirects();
	const [clothing, setClothing] = useState<ClothingItem[]>([]);
	const [models, setModels] = useState<Model[]>([]);
	const [generating, setGenerating] = useState(false);
	const [selectedFolder, setSelectedFolder] = useState<string>('');
	const [folders, setFolders] = useState<string[]>([]);
	const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
	const [newFolderName, setNewFolderName] = useState('');
	const [status, setStatus] = useState<GeneratorStatus>({
		open: false,
		message: '',
		severity: 'success',
	});

	const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const newItems: ClothingItem[] = Array.from(files).map((file) => ({
				id: `${Date.now()}-${Math.random()}`,
				name: file.name.replace(/\.[^/.]+$/, ''),
				file,
				preview: URL.createObjectURL(file),
			}));

			setClothing((currentClothing) => [...currentClothing, ...newItems]);
		}
	};

	const removeClothing = (id: string) => {
		setClothing((currentClothing) => {
			const item = currentClothing.find((clothingItem) => clothingItem.id === id);

			if (item) {
				URL.revokeObjectURL(item.preview);
			}

			return currentClothing.filter((clothingItem) => clothingItem.id !== id);
		});
	};

	const toggleModelSelection = (id: string) => {
		setModels((currentModels) => currentModels.map((model) => (model.id === id ? { ...model, selected: !model.selected } : model)));
	};

	const handleCreateFolder = () => {
		const trimmedName = newFolderName.trim();

		if (!trimmedName) {
			return;
		}

		setFolders((currentFolders) => (currentFolders.includes(trimmedName) ? currentFolders : [...currentFolders, trimmedName]));
		setSelectedFolder(trimmedName);
		setNewFolderName('');
		setNewFolderDialogOpen(false);
	};

	const selectedModels = models.filter((model) => model.selected).length;
	const canGenerate = clothing.length > 0 && selectedModels > 0 && selectedFolder !== '';

	const handleGenerate = () => {
		const totalAssets = clothing.length * selectedModels;
		setGenerating(true);
		setStatus({ open: true, message: `Rendering ${totalAssets} asset${totalAssets !== 1 ? 's' : ''}…`, severity: 'info' });

		setTimeout(() => {
			setGenerating(false);
			setStatus({
				open: true,
				message: `${totalAssets} asset${totalAssets !== 1 ? 's' : ''} generated successfully in "${selectedFolder}". Click here to view.`,
				severity: 'success',
			});
		}, 2000);
	};

	const handleSnackbarClick = () => {
		if (status.severity === 'success') {
			router.push('/assets');
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar onLogout={redirectToLogin} />

			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-8 py-12">
					<div className="flex items-center gap-2 mb-3">
						<span className="inline-block w-8 h-0.75 bg-[#e2001a]" />
						<Typography variant="overline" className="text-[#e2001a] font-bold tracking-[0.2em]">
							ASSET GENERATOR
						</Typography>
					</div>
					<Typography variant="h3" className="font-extrabold text-black mb-1">
						Create studio-quality visuals.
					</Typography>
					<Typography variant="body1" className="text-gray-500 max-w-2xl">
						Upload your cycling apparel, choose the models, and we&apos;ll render product images and 360° videos with pre-configured poses, lighting and camera angles.
					</Typography>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
				<FolderSelectorSection
					selectedFolder={selectedFolder}
					folders={folders}
					onSelectedFolderChange={setSelectedFolder}
					onCreateFolder={() => setNewFolderDialogOpen(true)}
				/>

				<ClothingUploadSection
					clothing={clothing}
					subtitle={`${clothing.length} item${clothing.length !== 1 ? 's' : ''} added`}
					onFileUpload={handleFileUpload}
					onRemove={removeClothing}
				/>

				<ModelSelectionSection models={models} subtitle={`${selectedModels} selected`} onToggleModel={toggleModelSelection} />

				<GenerateSection
					clothingCount={clothing.length}
					selectedModels={selectedModels}
					selectedFolder={selectedFolder}
					generating={generating}
					canGenerate={canGenerate}
					onGenerate={handleGenerate}
				/>
			</div>

			<GenerationFeedback
				status={status}
				onClose={() => setStatus((currentStatus) => ({ ...currentStatus, open: false }))}
				onClick={handleSnackbarClick}
			/>

			<NewFolderDialog
				open={newFolderDialogOpen}
				name={newFolderName}
				onNameChange={setNewFolderName}
				onCreate={handleCreateFolder}
				onClose={() => setNewFolderDialogOpen(false)}
			/>
		</div>
	);
}
