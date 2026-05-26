import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Navbar } from '@/components/Navbar';
import { useAuthRedirects } from '@/components/auth/useAuthRedirects';
import { ProjectGrid } from '@/components/assets/ProjectGrid';
import { AssetGrid } from '@/components/assets/AssetGrid';
import { EditProjectDialog } from '@/components/assets/EditProjectDialog';
import { useAssets } from '@/hooks/assets/useAssets';
import { useAssetProjects } from '@/hooks/assets/useAssetProjects';
import type { Project } from '@/types/types';
import ProjectService from '@/service/project/projectService';

export default function AssetsPage() {
	const router = useRouter();
	const { redirectToLogin } = useAuthRedirects();
	const [projects, setProjects] = useState<Project[]>([]);
	const projectService = new ProjectService();

	const { selectedProjectId, setSelectedProjectId, openEditDialog, editDialog } = useAssetProjects(
		projectService,
		(updated) => setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
	);

	const [loadingProjects, setLoadingProjects] = useState(true);
	const [projectError, setProjectError] = useState('');
	const { assets, filter, setFilter, filteredAssets, filters, loadingAssets, assetError } = useAssets(selectedProjectId);

	useEffect(() => {
		projectService
			.getAllProjects()
			.then((projectList) => {
				setProjects(projectList);
			})
			.catch(() => {
				setProjectError('Failed to load projects.');
			})
			.finally(() => {
				setLoadingProjects(false);
			});
	}, []);

	// Auto-select project from ?project= query param (set by generator on success)
	useEffect(() => {
		const query = router.query.project;
		if (typeof query === 'string') {
			const id = parseInt(query, 10);
			if (!isNaN(id)) setSelectedProjectId(id);
		}
	}, [router.query.project]);

	const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null;
	const totalAssets = projects.reduce((sum, p) => sum + p.itemCount, 0);

	const handleEditProject = (projectId: number) => {
		const projectToEdit = projects.find((p) => p.id === projectId);
		if (projectToEdit) {
			openEditDialog(projectToEdit);
		}
	};

	const handleDeleteProject = (projectId: number) => {
		setPendingDeleteId(projectId);
	};

	const confirmDeleteProject = async () => {
		if (pendingDeleteId === null) return;
		const id = pendingDeleteId;
		setPendingDeleteId(null);
		try {
			await projectService.deleteProject(id);
			setProjects((prev) => prev.filter((p) => p.id !== id));
		} catch {
			setProjectError('Verwijderen mislukt.');
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
								: `${projects.length} project${projects.length !== 1 ? 's' : ''} · ${totalAssets} total asset${totalAssets !== 1 ? 's' : ''}.`}
						</Typography>
						{projectError && (
							<Typography variant="body2" className="text-red-600 mt-2">
								{projectError}
							</Typography>
						)}
					</div>
					{selectedProject && (
						<Button
							variant="contained"
							className="bg-[#e2001a] text-white px-6 py-3 font-bold tracking-widest transition-all hover:bg-[#b80015] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40"
						>
							DOWNLOAD ALL
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
					<ProjectGrid projects={projects} onSelectProject={setSelectedProjectId} onEditProject={handleEditProject} />
				)}

				{selectedProject && assetError && (
					<Typography variant="body2" className="text-red-600 mb-4">
						{assetError}
					</Typography>
				)}

				{selectedProject && loadingAssets && (
					<Typography variant="body2" className="text-gray-500">
						Loading assets…
					</Typography>
				)}

				{selectedProject && !loadingAssets && !assetError && assets.length === 0 && (
					<Typography variant="body2" className="text-gray-500">
						No assets yet. Generate some from the generator page.
					</Typography>
				)}

				{selectedProject && !loadingAssets && <AssetGrid assets={filteredAssets} />}
			</div>

			<EditProjectDialog {...editDialog} />
		</div>
	);
}
