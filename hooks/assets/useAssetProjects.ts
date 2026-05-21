import { useState, type ChangeEvent } from "react";
import type { Project } from "@/types/types";
import type { EditProjectDialogState } from "@/types/types";
import { revokePreviewIfBlob } from "@/utils/preview";
import ProjectService from "@/service/project/projectService";
import { uploadToCloudinary } from "@/utils/cloudinary";

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

  const [isUploading, setIsUploading] = useState(false);

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

  const openEditDialog = (project: Project) => {
    setEditDialog({ open: true, projectId: project.id });
    setEditProject(project);
    setEditProjectName(project.name);

    setEditImagePreview(project.coverImage);
    setSelectedFile(null);
  };

  const closeEditDialog = () => {
    revokePreviewIfBlob(editImagePreview);

    setEditDialog({ open: false, projectId: null });
    setEditProject(null);
    setEditProjectName("");
    setEditImagePreview("");
    setSelectedFile(null);
  };

  const onSave = async () => {
    if (!editProject) return;

    setIsUploading(true);

    try {
      let coverImage = editProject.coverImage;

      // ONLY upload if user selected a new file
      if (selectedFile) {
        const publicId = await uploadToCloudinary(selectedFile);
        coverImage = publicId;
      }

      const updatedProject: Project = {
        ...editProject,
        name: editProjectName,
        coverImage,
      };

      const saved = await projectService.updateProjectDetails(
        editDialog.projectId!,
        updatedProject,
      );

      if (onProjectUpdated) onProjectUpdated(saved);
    } catch (err) {
      console.error("Failed to update project:", err);
    } finally {
      setIsUploading(false);
      closeEditDialog();
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
      onClose: closeEditDialog,
      onSave,
      isUploading,
    },
  };
}
