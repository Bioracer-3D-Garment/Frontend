import { useState, type ChangeEvent } from 'react';
import type { Project } from '@/types/types';
import type { EditProjectDialogState } from '@/types/types';
import { revokePreviewIfBlob } from '@/utils/preview';
import ProjectService from '@/service/project/projectService';


export function useAssetProjects(
	injectedProjectService: ProjectService = new ProjectService(),
	onProjectUpdated?: (project: Project) => void,
) {
	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
	const [editDialog, setEditDialog] = useState<EditProjectDialogState>({ open: false, projectId: null });
	const [editProject, setEditProject] = useState<Project | null>(null);
	const [editProjectName, setEditProjectName] = useState('');
	const [editImagePreview, setEditImagePreview] = useState('');
	const [projectService] = useState(() => injectedProjectService);


	const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file) {
			return;
		}

		revokePreviewIfBlob(editImagePreview);

		const preview = URL.createObjectURL(file);
		setEditImagePreview(preview);
	};

	const closeEditDialog = () => {
		revokePreviewIfBlob(editImagePreview);

		setEditDialog({ open: false, projectId: null });
		setEditProject(null);
		setEditProjectName('');
		setEditImagePreview('');
	};

	const openEditDialog = (project: Project) => {
		setEditDialog({ open: true, projectId: project.id });
		setEditProject(project);
		setEditProjectName(project.name);
		setEditImagePreview(project.coverImage);
	};
	
	const onSave = async () => {
		if (!editProject) {
			return;
		}

		const updatedProject: Project = {
			...editProject,
			name: editProjectName,
			coverImage: editImagePreview,
		};

		try {
			const saved = await projectService.updateProjectDetails(editDialog.projectId!, {
				...updatedProject,
			});

			if (onProjectUpdated) onProjectUpdated(saved);
		} catch (err) {
			return String('Failed to update project.');
		}

		closeEditDialog();
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
		},
	};
}
