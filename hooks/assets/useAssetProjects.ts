import { useState, type ChangeEvent, type MouseEvent } from 'react';
import type { EditProjectDialogState } from '@/types/types';
import { revokePreviewIfBlob } from '@/utils/preview';

export function useAssetProjects() {
	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
	const [editDialog, setEditDialog] = useState<EditProjectDialogState>({ open: false, projectId: null });
	const [editProjectName, setEditProjectName] = useState('');
	const [editImagePreview, setEditImagePreview] = useState('');

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
		setEditProjectName('');
		setEditImagePreview('');
	};

	

	return {
		selectedProjectId,
		setSelectedProjectId,
		editDialog: {
			open: editDialog.open,
			projectName: editProjectName,
			projectImagePreview: editImagePreview,
			onProjectNameChange: setEditProjectName,
			onImageFileChange: handleImageFileChange,
			onClose: closeEditDialog,
		},
	};
}
