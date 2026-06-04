import { Typography } from '@mui/material';
import { Navbar } from '@/components/Navbar';
import { useAuthRedirects } from '@/components/auth/useAuthRedirects';
import { ProjectSelectorSection } from '@/components/generator/project/ProjectSelectorSection';
import { ClothingUploadSection } from '@/components/generator/clothing/ClothingUploadSection';
import { ModelSelectionSection } from '@/components/generator/model/ModelSelectionSection';
import { GenerateSection } from '@/components/generator/generation/GenerateSection';
import { ModusSelectionSection } from '@/components/generator/generation/ModusSelectionSection';
import { GenerationFeedback } from '@/components/generator/generation/GenerationFeedback';
import { NewProjectDialog } from '@/components/generator/project/NewProjectDialog';
import { useProjects } from '@/hooks/generator/useFolders';
import { useModels } from '@/hooks/generator/useModels';
import { useGeneration } from '@/hooks/generator/useGeneration';
import { useClothing } from '@/hooks/generator/useClothing';
import { useState } from 'react';
import type { Resolution, FrameOutputFormat, VideoOptions } from '@/types/types';

export default function GeneratorPage() {
  const { redirectToLogin } = useAuthRedirects();
  const {
    frontDesign,
    backDesign,
    handleFrontUpload,
    handleBackUpload,
  } = useClothing();
  const {
    projects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    openCreateProjectDialog,
    dialog,
  } = useProjects();
  const {
    models,
    loading: modelsLoading,
    selectedModels,
    selectedGender,
    toggleModel,
    addModel,
    updateModel,
    deleteModel,
  } = useModels();
  const selectedModelId = selectedModels[0]?.id ?? null;
  const generation = useGeneration({
    frontDesign,
    backDesign,
    selectedModelId,
    selectedProjectName: selectedProject?.name ?? "",
    selectedProjectId,
  });

  const [generationOptions, setGenerationOptions] =
    useState<{
      resolution: Resolution;
      frameOutputFormat: FrameOutputFormat;
      prompt?: string;
    }>({
      resolution: "2k",
      frameOutputFormat: "png",
      prompt:
        "Full body studio photo of a young adult male model, slim athletic build, " +
        "short brown hair, neutral confident expression, standing straight with " +
        "arms relaxed at the sides, slight weight on one leg. Clean light grey " +
        "studio background with soft floor shadow. Soft even studio lighting, " +
        "sharp and clean, professional sportswear lookbook style.",
    });

  const [videoOptions, setVideoOptions] =
    useState<VideoOptions>({
      enabled: false,
      durationSeconds: 5,
      prompt: "",
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={redirectToLogin} />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-8 h-0.75 bg-[#e2001a]" />
            <Typography
              variant="overline"
              className="text-[#e2001a] font-bold tracking-[0.2em]"
            >
              ASSET GENERATOR
            </Typography>
          </div>
          <Typography
            variant="h3"
            className="font-extrabold text-black mb-1"
          >
            Create studio-quality visuals.
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-500 max-w-2xl"
          >
            Upload front and back views of your cycling
            apparel, choose a model, and we&apos;ll render
            studio-quality product images automatically.
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
          onFrontUpload={handleFrontUpload}
          onBackUpload={handleBackUpload}
        />

        <ModelSelectionSection
          models={models}
          loading={modelsLoading}
          selectedModels={selectedModels}
          subtitle={
            selectedModels.length > 0
              ? selectedModels.map((m) => m.name).join(", ")
              : "None selected"
          }
          onToggleModel={toggleModel}
          onAddModel={addModel}
          onUpdateModel={updateModel}
          onDeleteModel={deleteModel}
        />

        <ModusSelectionSection
          photoValues={generationOptions}
          onPhotoChange={(patch) =>
            setGenerationOptions((prev) => ({
              ...prev,
              ...patch,
            }))
          }
          videoValues={videoOptions}
          onVideoChange={(patch) =>
            setVideoOptions((prev) => ({
              ...prev,
              ...patch,
            }))
          }
        />

        <GenerateSection
          clothingCount={frontDesign && backDesign ? 1 : 0}
          selectedGender={selectedGender ?? ""}
          selectedProjectName={selectedProject?.name ?? ""}
          generating={generation.generating}
          progress={generation.progress}
          canGenerate={generation.canGenerate}
          onGenerate={() =>
            generation.handleGenerate(
              generationOptions,
              videoOptions,
            )
          }
        />

        {generation.generatedAssets &&
          generation.generatedAssets.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block w-8 h-0.75 bg-[#e2001a]" />
                <Typography
                  variant="overline"
                  className="text-[#e2001a] font-bold tracking-[0.2em]"
                >
                  GENERATED ·{" "}
                  {generation.generatedAssets.length} ASSET
                  {generation.generatedAssets.length !== 1
                    ? "S"
                    : ""}
                </Typography>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {generation.generatedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="shrink-0 w-32 rounded overflow-hidden bg-gray-100 border border-gray-200"
                  >
                    <img
                      src={asset.thumbnailUrl}
                      alt={`${asset.productId} · ${asset.poseId}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="px-2 py-1">
                      <Typography
                        variant="caption"
                        className="text-gray-500 block text-center capitalize"
                      >
                        {asset.poseId}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
      </div>

      <GenerationFeedback
        status={generation.status}
        onClose={generation.closeStatus}
        onClick={generation.handleSnackbarClick}
      />

      <NewProjectDialog {...dialog} />
    </div>
  );
}
