import { useState, type ChangeEvent, type MouseEvent } from 'react';
import { Typography, Button } from '@mui/material';
import { Download, ArrowBack } from '@mui/icons-material';
import { Navbar } from '@/components/Navbar';
import { useAuthRedirects } from '@/components/auth/useAuthRedirects';
import type { Asset, EditFolderDialogState, FolderData } from '@/types/types';
import { FolderGrid } from '@/components/assets/FolderGrid';
import { AssetGrid } from '@/components/assets/AssetGrid';
import { EditFolderDialog } from '@/components/assets/EditFolderDialog';

export default function AssetsPage() {
	const { redirectToLogin } = useAuthRedirects();
	const [folders, setFolders] = useState<FolderData[]>([]);
	const [assets, setAssets] = useState<Asset[]>([]);
	const [currentFolder, setCurrentFolder] = useState<string | null>(null);
	const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
	const [editDialog, setEditDialog] = useState<EditFolderDialogState>({ open: false, folderId: null });
	const [editFolderName, setEditFolderName] = useState('');
	const [editImagePreview, setEditImagePreview] = useState('');

	const currentFolderData = currentFolder ? folders.find((folder) => folder.id === currentFolder) : null;
	const folderAssets = currentFolder ? assets.filter((asset) => asset.folderId === currentFolder) : [];
	const filteredAssets = filter === 'all' ? folderAssets : folderAssets.filter((asset) => asset.type === filter);

	const filters: { key: typeof filter; label: string; count: number }[] = [
		{ key: 'all', label: 'All', count: folderAssets.length },
		{ key: 'image', label: 'Images', count: folderAssets.filter((asset) => asset.type === 'image').length },
		{ key: 'video', label: 'Videos', count: folderAssets.filter((asset) => asset.type === 'video').length },
	];

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

		if (editImagePreview && !editImagePreview.startsWith('http')) {
			URL.revokeObjectURL(editImagePreview);
		}

		const preview = URL.createObjectURL(file);
		setEditImagePreview(preview);
	};

	const closeEditDialog = () => {
		if (editImagePreview && !editImagePreview.startsWith('http')) {
			URL.revokeObjectURL(editImagePreview);
		}

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

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar onLogout={redirectToLogin} />

			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div>
						<div className="flex items-center gap-2 mb-3">
							<span className="inline-block w-8 h-0.75 bg-[#e2001a]" />
							<Typography variant="overline" className="text-[#e2001a] font-bold tracking-[0.2em]">
								LIBRARY
							</Typography>
						</div>
						<Typography variant="h3" className="font-extrabold text-black">
							{currentFolder ? currentFolderData?.name : 'Assets'}
						</Typography>
						<Typography variant="body1" className="text-gray-500 mt-1">
							{currentFolder
								? `${filteredAssets.length} asset${filteredAssets.length !== 1 ? 's' : ''} in this folder.`
								: `${folders.length} folder${folders.length !== 1 ? 's' : ''} · ${assets.length} total assets.`}
						</Typography>
					</div>
					{currentFolder && (
						<Button
							variant="contained"
							startIcon={<Download />}
							className="bg-[#e2001a] text-white px-6 py-3 font-bold tracking-widest transition-all hover:bg-[#b80015] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40"
						>
							DOWNLOAD ALL
						</Button>
					)}
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-8 py-10">
				{currentFolder && (
					<button
						onClick={() => setCurrentFolder(null)}
						className="flex items-center gap-2 mb-6 text-sm font-bold tracking-wider text-gray-600 hover:text-[#e2001a] transition-all hover:-translate-x-1"
					>
						<ArrowBack fontSize="small" />
						BACK TO FOLDERS
					</button>
				)}

				{currentFolder && (
					<div className="flex gap-2 mb-8 border-b border-gray-200">
						{filters.map((item) => (
							<button
								key={item.key}
								onClick={() => setFilter(item.key)}
								className={`px-5 py-3 text-sm font-bold tracking-wider transition relative ${
									filter === item.key ? 'text-black' : 'text-gray-500 hover:text-black'
								}`}
							>
								{item.label.toUpperCase()} <span className="text-gray-400 ml-1">({item.count})</span>
								{filter === item.key && <span className="absolute left-0 right-0 -bottom-px h-0.75 bg-[#e2001a]" />}
							</button>
						))}
					</div>
				)}

				{!currentFolder && <FolderGrid folders={folders} onOpenFolder={setCurrentFolder} onEditFolder={openEditDialog} />}
				{currentFolder && <AssetGrid assets={filteredAssets} />}
			</div>

			<EditFolderDialog
				open={editDialog.open}
				folderName={editFolderName}
				folderImagePreview={editImagePreview}
				onFolderNameChange={setEditFolderName}
				onImageFileChange={handleImageFileChange}
				onClose={closeEditDialog}
				onSave={saveFolder}
			/>
		</div>
	);
}
