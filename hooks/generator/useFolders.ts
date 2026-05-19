import { useState } from 'react';
import type { FolderData } from '@/types/types';
import { createFolder } from '@/utils/folder';

export function useFolders() {
	const [folders, setFolders] = useState<FolderData[]>([]);
	const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
	const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
	const [newFolderName, setNewFolderName] = useState('');

	const selectedFolder = folders.find(
		(folder) => folder.id === selectedFolderId,
	);

	const openCreateFolderDialog = () => setNewFolderDialogOpen(true);

	const closeCreateFolderDialog = () => setNewFolderDialogOpen(false);

	const handleCreateFolder = () => {
		const trimmedName = newFolderName.trim();

		if (!trimmedName) {
			return;
		}

		const existing = folders.find((folder) => folder.name.toLowerCase() === trimmedName.toLowerCase());

		if (existing) {
			setSelectedFolderId(existing.id);
		} else {
			const folder = createFolder(trimmedName);
			setFolders((currentFolders) => [...currentFolders, folder]);
			setSelectedFolderId(folder.id);
		}

		setNewFolderName('');
		setNewFolderDialogOpen(false);
	};

	return {
		folders,
		selectedFolderId,
		selectedFolder,
		onSelectedFolderIdChange: setSelectedFolderId,
		onCreateFolder: openCreateFolderDialog,
		dialog: {
			open: newFolderDialogOpen,
			name: newFolderName,
			onNameChange: setNewFolderName,
			onCreate: handleCreateFolder,
			onClose: closeCreateFolderDialog,
		},
	};
}
