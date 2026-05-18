import { Typography } from '@mui/material';
import { Navbar } from '@/components/Navbar';
import { useAuthRedirects } from '@/components/auth/useAuthRedirects';
import { FolderSelectorSection } from '@/components/generator/folder/FolderSelectorSection';
import { ClothingUploadSection } from '@/components/generator/clothing/ClothingUploadSection';
import { ModelSelectionSection } from '@/components/generator/model/ModelSelectionSection';
import { GenerateSection } from '@/components/generator/generation/GenerateSection';
import { GenerationFeedback } from '@/components/generator/generation/GenerationFeedback';
import { NewFolderDialog } from '@/components/generator/folder/NewFolderDialog';
import { useClothing } from '@/hooks/generator/useClothing';
import { useFolders } from '@/hooks/generator/useFolders';
import { useModels } from '@/hooks/generator/useModels';
import { useGeneration } from '@/hooks/generator/useGeneration';

export default function GeneratorPage() {
	const { redirectToLogin } = useAuthRedirects();
	const { clothing, handleFileUpload, removeClothing } = useClothing();
	const folders = useFolders();
	const { models, selectedModels, toggleModelSelection } = useModels();
	const generation = useGeneration({
		clothingCount: clothing.length,
		selectedModels,
		selectedFolderName: folders.selectedFolder?.name ?? '',
		selectedFolderId: folders.selectedFolderId,
	});

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
					selectedFolderId={folders.selectedFolderId}
					folders={folders.folders}
					onSelectedFolderIdChange={folders.onSelectedFolderIdChange}
					onCreateFolder={folders.onCreateFolder}
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
					selectedFolderName={folders.selectedFolder?.name ?? ''}
					generating={generation.generating}
					canGenerate={generation.canGenerate}
					onGenerate={generation.handleGenerate}
				/>
			</div>

			<GenerationFeedback status={generation.status} onClose={generation.closeStatus} onClick={generation.handleSnackbarClick} />

			<NewFolderDialog {...folders.dialog} />
		</div>
	);
}
