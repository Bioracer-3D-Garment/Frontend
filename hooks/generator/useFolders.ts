import { useState, useEffect, useMemo } from 'react';
import type { Project } from '@/types/types';
import ProjectService from '@/service/project/projectService';

export function useProjects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
	const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');
	const [createProjectError, setCreateProjectError] = useState('');

	const selectedProject = projects.find(
		(project) => project.id === selectedProjectId,
	);

	const projectService = useMemo(() => new ProjectService(), []);

	useEffect(() => {
		projectService
			.getUserProjects()
			.then(setProjects)
			.catch((err) => console.error('Failed to load projects', err));
	}, [projectService]);

	const handleCreateProject = async () => {
		const trimmedName = newProjectName.trim();

		if (!trimmedName) {
			return;
		}

		setCreateProjectError('');

		const existing = projects.find((project) => project.name.toLowerCase() === trimmedName.toLowerCase());

		if (existing) {
			setSelectedProjectId(existing.id);
			setNewProjectName('');
			setNewProjectDialogOpen(false);
			return;
		}

		try {
			const project = await projectService.createProject(trimmedName);
			setProjects((currentProjects) => [...currentProjects, project]);
			setSelectedProjectId(project.id);
			setNewProjectName('');
			setNewProjectDialogOpen(false);
		} catch {
			setCreateProjectError('Failed to create project. Please try again.');
		}
	};

	return {
		projects,
		selectedProjectId,
		selectedProject,
		setSelectedProjectId,
		openCreateProjectDialog: () => setNewProjectDialogOpen(true),
		dialog: {
			open: newProjectDialogOpen,
			name: newProjectName,
			onNameChange: setNewProjectName,
			onCreate: handleCreateProject,
			onClose: () => setNewProjectDialogOpen(false),
			error: createProjectError,
		},
	};
}
