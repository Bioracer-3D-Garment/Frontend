import { useState, type ChangeEvent, type MouseEvent } from 'react';
import type { EditFolderDialogState, FolderData } from '@/types/types';
import { revokePreviewIfBlob } from '@/utils/preview';

export function useAssetFolders() {
	const [folders, setFolders] = useState<FolderData[]>([]);
	const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
	const [editDialog, setEditDialog] = useState<EditFolderDialogState>({ open: false, folderId: null });
	const [editFolderName, setEditFolderName] = useState('');
	const [editImagePreview, setEditImagePreview] = useState('');

	const selectedFolderData = selectedFolderId ? folders.find((folder) => folder.id === selectedFolderId) : null;

	const openEditDialog = (folderId: string, event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		const folder = folders.find((item) => item.id === folderId);

		if (!folder) {
			return;
		}

		setEditFolderName(folder.name);
		setEditImagePreview(folder.coverImage);
		setEditDialog({ open: true, folderId });
	};

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

		setEditDialog({ open: false, folderId: null });
		setEditFolderName('');
		setEditImagePreview('');
	};

	const saveFolder = () => {
		if (!editDialog.folderId || !editFolderName.trim()) {
			return;
		}

		setFolders(
			folders.map((folder) =>
				folder.id === editDialog.folderId ? { ...folder, name: editFolderName.trim(), coverImage: editImagePreview } : folder
			)
		);
		closeEditDialog();
	};

	return {
		folders,
		selectedFolderId,
		selectedFolderData,
		setSelectedFolderId,
		openEditDialog,
		editDialog: {
			open: editDialog.open,
			folderName: editFolderName,
			folderImagePreview: editImagePreview,
			onFolderNameChange: setEditFolderName,
			onImageFileChange: handleImageFileChange,
			onClose: closeEditDialog,
			onSave: saveFolder,
		},
	};
}
