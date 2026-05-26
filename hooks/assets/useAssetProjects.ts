import { useState, type ChangeEvent } from "react";
import type { Project } from "@/types/types";
import type { EditProjectDialogState } from "@/types/types";
import { revokePreviewIfBlob } from "@/utils/preview";
import ProjectService from "@/service/project/projectService";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { buildProjectPayload } from "@/utils/projectPayload";

export function useAssetProjects(
  injectedProjectService: ProjectService = new ProjectService(),
  onProjectUpdated?: (project: Project) => void,
) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const [editDialog, setEditDialog] = useState<EditProjectDialogState>({
    open: false,
    projectId: null,
  });

  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState("");

  // shows preview OR existing image
  const [editImagePreview, setEditImagePreview] = useState("");

  // IMPORTANT: store selected FILE, not upload result
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [projectService] = useState(() => injectedProjectService);

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    revokePreviewIfBlob(editImagePreview);

    // ONLY local preview
    const preview = URL.createObjectURL(file);
    setEditImagePreview(preview);

    // store file for later upload
    setSelectedFile(file);
  };

  const handleGalleryImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedGalleryFiles(Array.from(event.target.files ?? []));
  };

  const openEditDialog = (project: Project) => {
    setErrorMessage("");
    setEditDialog({ open: true, projectId: project.id });
    setEditProject(project);
    setEditProjectName(project.name);

    setEditImagePreview(project.coverImage);
    setSelectedFile(null);
    setSelectedGalleryFiles([]);
  };

  const closeEditDialog = () => {
    revokePreviewIfBlob(editImagePreview);

    setEditDialog({ open: false, projectId: null });
    setEditProject(null);
    setEditProjectName("");
    setEditImagePreview("");
    setSelectedFile(null);
    setSelectedGalleryFiles([]);
    setErrorMessage("");
  };

  const onSave = async () => {
    if (!editProject) return;

    setIsUploading(true);
    setErrorMessage("");

    try {
      let coverImage = editProject.coverImage;
      let galleryImages = editProject.galleryImages ?? [];

      // ONLY upload if user selected a new file
      if (selectedFile) {
        coverImage = await uploadToCloudinary(selectedFile);
      }

      if (selectedGalleryFiles.length > 0) {
        const uploadedGalleryImages = await Promise.all(
          selectedGalleryFiles.map((file) => uploadToCloudinary(file)),
        );

        galleryImages = [...galleryImages, ...uploadedGalleryImages];
      }

      const updatedProject = buildProjectPayload(
        editProjectName,
        coverImage,
        galleryImages,
      );

      const saved = await projectService.updateProjectDetails(
        editDialog.projectId!,
        updatedProject,
      );

      if (onProjectUpdated) onProjectUpdated(saved);
      closeEditDialog();
    } catch (err) {
      console.error("Failed to update project:", err);
      setErrorMessage("Failed to upload images or save the project. Check Cloudinary and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    selectedProjectId,
    setSelectedProjectId,

    openEditDialog,

    editDialog: {
      open: editDialog.open,
      projectName: editProjectName,
      projectImagePreview: editImagePreview,
      onProjectNameChange: setEditProjectName,
      onImageFileChange: handleImageFileChange,
      onGalleryImagesChange: handleGalleryImagesChange,
      onClose: closeEditDialog,
      onSave,
      isUploading,
      galleryImageCount: selectedGalleryFiles.length,
      errorMessage,
    },
  };
}
