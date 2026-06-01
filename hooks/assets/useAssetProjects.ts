import { useState } from "react";
import type { Project } from "@/types/types";
import type { EditProjectDialogState } from "@/types/types";
import { revokePreviewIfBlob } from "@/utils/preview";
import ProjectService from "@/service/project/projectService";

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
  const [editCoverImageTag, seteditCoverImageTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [projectService] = useState(() => injectedProjectService);

  const openEditDialog = (project: Project) => {
    setEditDialog({ open: true, projectId: project.id });
    setEditProject(project);
    setEditProjectName(project.name);
    seteditCoverImageTag(project.coverImage ?? "");
    setSaveError("");
  };

  const closeEditDialog = () => {
    revokePreviewIfBlob(editCoverImageTag);
    setEditDialog({ open: false, projectId: null });
    setEditProject(null);
    setEditProjectName("");
    seteditCoverImageTag("");
    setSaveError("");
  };

  const onSave = async () => {
    if (!editProject) return;

    setIsSaving(true);
    setSaveError("");

    try {
      const saved = await projectService.updateProjectDetails(
        editDialog.projectId!,
        { name: editProjectName, coverImage: editCoverImageTag },
      );

      if (onProjectUpdated) onProjectUpdated(saved);
      closeEditDialog();
    } catch {
      setSaveError("Failed to save project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

const handleDelete = async () => {
  if (!editProject) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${editProject.name}"?`
  );

  if (!confirmed) return;

  try {
    setIsDeleting(true);

    await projectService.deleteProject(editProject.id);

    closeEditDialog();

    window.location.reload();

  } catch (err) {
    console.error(err);
    setSaveError("Failed to delete project.");
  } finally {
    setIsDeleting(false);
  }
};

  return {
    selectedProjectId,
    setSelectedProjectId,

    openEditDialog,

    editDialog: {
      open: editDialog.open,
      projectName: editProjectName,
      projectImageTag: editCoverImageTag,
      onProjectNameChange: setEditProjectName,
      onImageUrlChange: seteditCoverImageTag,
      onClose: closeEditDialog,
      onSave,
      isSaving,
      saveError,
      handleDelete,
      isDeleting,
    },
  };
}
