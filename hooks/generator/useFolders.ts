import { useState } from 'react';
import type { Project } from '@/types/types';
import { createProject } from '@/utils/folder';
import ProjectService from '@/service/project/projectService';

export function useProjects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
	const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');

	const selectedProject = projects.find(
		(project) => project.id === selectedProjectId,
	);

	const projectService = new ProjectService();

	const handleCreateProject = async () => {
		const trimmedName = newProjectName.trim();

		if (!trimmedName) {
			return;
		}

		const existing = projects.find((project) => project.name.toLowerCase() === trimmedName.toLowerCase());

		if (existing) {
			setSelectedProjectId(existing.id);
		} else {
			try {
				const project = await projectService.createProject(trimmedName);
				setProjects((currentProjects) => [...currentProjects, project]);
				setSelectedProjectId(project.id);
			} catch (err) {
				console.error('Failed to create project via API, falling back to local creation', err);
				const project = createProject(trimmedName);
				setProjects((currentProjects) => [...currentProjects, project]);
				setSelectedProjectId(project.id);
			}
		}

		setNewProjectName('');
		setNewProjectDialogOpen(false);
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
		},
	};
}
