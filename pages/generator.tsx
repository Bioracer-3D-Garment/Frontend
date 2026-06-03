import { Typography } from '@mui/material';
import { Navbar } from '@/components/Navbar';
import { useAuthRedirects } from '@/components/auth/useAuthRedirects';
import { ProjectSelectorSection } from '@/components/generator/project/ProjectSelectorSection';
import { ClothingUploadSection } from '@/components/generator/clothing/ClothingUploadSection';
import { ModelSelectionSection } from '@/components/generator/model/ModelSelectionSection';
import { GenerateSection } from '@/components/generator/generation/GenerateSection';
import { AdvancedSection } from '@/components/generator/generation/AdvancedSection';
import { GenerationFeedback } from '@/components/generator/generation/GenerationFeedback';
import { NewProjectDialog } from '@/components/generator/project/NewProjectDialog';
import { useProjects } from '@/hooks/generator/useFolders';
import { useModels } from '@/hooks/generator/useModels';
import { useGeneration } from '@/hooks/generator/useGeneration';
import { useState } from 'react';
import type { Resolution, FrameFormat, FrameOutputFormat } from '@/types/types';

export default function GeneratorPage() {
	const { redirectToLogin } = useAuthRedirects();
	const { projects, selectedProjectId, selectedProject, setSelectedProjectId, openCreateProjectDialog, dialog } = useProjects();
	const { models, selectedModel, selectModel } = useModels();

	const [frontDesign, setFrontDesign] = useState<File | null>(null);
	const [backDesign, setBackDesign] = useState<File | null>(null);

	const generation = useGeneration({
		frontDesign,
		backDesign,
		modelId: selectedModel?.id ?? null,
		selectedProjectName: selectedProject?.name ?? '',
		selectedProjectId,
	});

	const [generationOptions, setGenerationOptions] = useState<{
		resolution: Resolution;
		frameFormat: FrameFormat;
		frameOutputFormat: FrameOutputFormat;
		prompt?: string;
	}>({
		resolution: '2k',
		frameFormat: 'portrait',
		frameOutputFormat: 'png',
		prompt: "Fit the garment onto the model exactly as shown in the product image. " +
            "Preserve all text, logos, graphics, colors, patterns, and fabric details on the garment " +
            "with pixel-accurate fidelity — do not alter, distort, remove, or reinterpret any design elements. " +
            "The garment contains the text 'Bioracer' — reproduce it exactly as printed. " +
            "Do not modify the model's face, skin tone, hair, pose, or body in any way. " +
            "The garment should appear naturally worn with realistic draping, fit, and lighting " +
            "consistent with the model image."
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
						Upload your cycling apparel designs, choose a model, and we&apos;ll render front, back and side product images automatically.
					</Typography>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
				<ProjectSelectorSection
					selectedProjectId={selectedProjectId}
					projects={projects}
					onSelectProject={setSelectedProjectId}
					onCreateProject={openCreateProjectDialog}
				/>

				<ClothingUploadSection
					frontDesign={frontDesign}
					backDesign={backDesign}
					onFrontUpload={setFrontDesign}
					onBackUpload={setBackDesign}
				/>

				<ModelSelectionSection
					models={models}
					subtitle={selectedModel?.name ?? 'None selected'}
					onToggleModel={selectModel}
				/>

				<AdvancedSection
					values={generationOptions}
					onChange={(patch) => setGenerationOptions((prev) => ({ ...prev, ...patch }))}
				/>

				<GenerateSection
					clothingCount={(frontDesign ? 1 : 0) + (backDesign ? 1 : 0)}
					selectedProjectName={selectedProject?.name ?? ''}
					generating={generation.generating}
					progress={generation.progress}
					canGenerate={generation.canGenerate}
					onGenerate={() => generation.handleGenerate(generationOptions)} selectedGender={''}				/>

				{generation.generatedAssets && generation.generatedAssets.length > 0 && (
					<section>
						<div className="flex items-center gap-2 mb-4">
							<span className="inline-block w-8 h-0.75 bg-[#e2001a]" />
							<Typography variant="overline" className="text-[#e2001a] font-bold tracking-[0.2em]">
								GENERATED · {generation.generatedAssets.length} ASSET{generation.generatedAssets.length !== 1 ? 'S' : ''}
							</Typography>
						</div>
						<div className="flex gap-3 overflow-x-auto pb-2">
							{generation.generatedAssets.map((asset) => (
								<div key={asset.id} className="shrink-0 w-32 rounded overflow-hidden bg-gray-100 border border-gray-200">
									<img
										src={asset.thumbnailUrl}
										alt={`${asset.productId} · ${asset.poseId}`}
										className="w-full h-32 object-cover"
									/>
									<div className="px-2 py-1">
										<Typography variant="caption" className="text-gray-500 block text-center capitalize">
											{asset.poseId}
										</Typography>
									</div>
								</div>
							))}
						</div>
					</section>
				)}
			</div>

			<GenerationFeedback status={generation.status} onClose={generation.closeStatus} onClick={generation.handleSnackbarClick} />

			<NewProjectDialog {...dialog} />
		</div>
	);
}