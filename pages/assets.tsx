import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Typography, Button } from '@mui/material';
import { Download, ArrowBack } from '@mui/icons-material';
import { Navbar } from '@/components/Navbar';
import { useAuthRedirects } from '@/components/auth/useAuthRedirects';
import { ProjectGrid } from '@/components/assets/ProjectGrid';
import { AssetGrid } from '@/components/assets/AssetGrid';
import { EditProjectDialog } from '@/components/assets/EditProjectDialog';
import { useAssets } from '@/hooks/assets/useAssets';
import { useAssetProjects } from '@/hooks/assets/useAssetProjects';
import type { Project } from '@/types/types';
import ProjectService from '@/service/project/projectService';
import AssetService from '@/service/asset/assetService';

export default function AssetsPage() {
	const router = useRouter();
	const { redirectToLogin } = useAuthRedirects();
	const [projects, setProjects] = useState<Project[]>([]);
	const projectService = useMemo(() => new ProjectService(), []);

	const { selectedProjectId, setSelectedProjectId, openEditDialog, editDialog } = useAssetProjects(
		projectService,
		(updated) => setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
	);

	const assetService = useMemo(() => new AssetService(), []);
	const [loadingProjects, setLoadingProjects] = useState(true);
	const [projectError, setProjectError] = useState('');
	const [downloadingAll, setDownloadingAll] = useState(false);
	const { assets, filter, setFilter, filteredAssets, filters, error: assetError, deleteAsset } = useAssets(selectedProjectId);

	useEffect(() => {
		projectService
			.getUserProjects()
			.then((projectList) => {
				setProjects(projectList);
			})
			.catch(() => {
				setProjectError('Failed to load projects.');
			})
			.finally(() => {
				setLoadingProjects(false);
			});
	}, [projectService]);

	useEffect(() => {
		const { projectId } = router.query;
		if (projectId && typeof projectId === 'string') {
			const id = parseInt(projectId, 10);
			if (!isNaN(id)) {
				setSelectedProjectId(id);
			}
		}
	}, [router.query.projectId]);

	const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null;

	const handleEditProject = (projectId: number) => {
		const projectToEdit = projects.find((p) => p.id === projectId);
		if (projectToEdit) {
			openEditDialog(projectToEdit);
		}
	};

	const handleDeleteAsset = async (assetId: number) => {
		try {
			await deleteAsset(assetId);
		} catch {
			setProjectError('Failed to delete asset.');
		}
	};

	const handleDownloadAll = async () => {
		if (!selectedProject || downloadingAll) return;
		setDownloadingAll(true);
		try {
			await assetService.downloadProjectAssets(selectedProject.id, selectedProject.name);
		} catch {
			setProjectError('Failed to download project assets.');
		} finally {
			setDownloadingAll(false);
		}
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
								PROJECTS
							</Typography>
						</div>
						<Typography variant="h3" className="font-extrabold text-black">
							{selectedProject ? selectedProject.name : 'Projects'}
						</Typography>
						<Typography variant="body1" className="text-gray-500 mt-1">
							{selectedProject
								? `${filteredAssets.length} asset${filteredAssets.length !== 1 ? 's' : ''} in this project.`
								: `${projects.length} project${projects.length !== 1 ? 's' : ''}.`}
						</Typography>
						{(projectError || assetError) && (
							<Typography variant="body2" className="text-red-600 mt-2">
								{projectError || assetError}
							</Typography>
						)}
					</div>
					{selectedProject && (
						<Button
							variant="contained"
							startIcon={<Download />}
							disabled={downloadingAll}
							onClick={handleDownloadAll}
							className="bg-[#e2001a] text-white px-6 py-3 font-bold tracking-widest transition-all hover:bg-[#b80015] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40 disabled:opacity-60"
						>
							{downloadingAll ? 'DOWNLOADING...' : 'DOWNLOAD ALL'}
						</Button>
					)}
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-8 py-10">
				{selectedProject && (
					<button
						onClick={() => setSelectedProjectId(null)}
						className="flex items-center gap-2 mb-6 text-sm font-bold tracking-wider text-gray-600 hover:text-[#e2001a] transition-all hover:-translate-x-1"
					>
						<ArrowBack fontSize="small" />
						BACK TO PROJECTS
					</button>
				)}

				{selectedProject && (
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

				{!selectedProject && !loadingProjects && (
					<ProjectGrid
						projects={projects}
						onSelectProject={setSelectedProjectId}
						onEditProject={handleEditProject}
					/>
				)}

				{selectedProject && <AssetGrid assets={filteredAssets} onDelete={handleDeleteAsset} />}
			</div>

			<EditProjectDialog
				open={editDialog.open}
				projectName={editDialog.projectName}
				projectImageUrl={editDialog.projectImageUrl}
				onProjectNameChange={editDialog.onProjectNameChange}
				onImageUrlChange={editDialog.onImageUrlChange}
				onClose={editDialog.onClose}
				onSave={editDialog.onSave}
				isSaving={editDialog.isSaving}
				saveError={editDialog.saveError}
			/>
		</div>
	);
}
