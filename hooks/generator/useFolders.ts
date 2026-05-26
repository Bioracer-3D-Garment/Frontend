import { useState, type ChangeEvent } from 'react';
import type { Project } from '@/types/types';
import { createProject } from '@/utils/folder';
import { buildProjectPayload } from '@/utils/projectPayload';
import { uploadToCloudinary } from '@/utils/cloudinary';
import ProjectService from '@/service/project/projectService';

export function useProjects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
	const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');
	const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
	const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
	const [isCreating, setIsCreating] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const selectedProject = projects.find(
		(project) => project.id === selectedProjectId,
	);

	const projectService = new ProjectService();

	const handleCoverImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		setCoverImageFile(event.target.files?.[0] ?? null);
	};

	const handleGalleryImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
		setGalleryImageFiles(Array.from(event.target.files ?? []));
	};

	const handleCreateProject = async () => {
		const trimmedName = newProjectName.trim();
		setErrorMessage('');

		if (!trimmedName) {
			return;
		}

		const existing = projects.find((project) => project.name.toLowerCase() === trimmedName.toLowerCase());

		if (existing) {
			setSelectedProjectId(existing.id);
		} else {
			setIsCreating(true);
			let coverImage = '';
			let galleryImages: string[] = [];
			try {
				[coverImage, galleryImages] = await Promise.all([
					coverImageFile ? uploadToCloudinary(coverImageFile) : Promise.resolve(''),
					galleryImageFiles.length > 0
						? Promise.all(galleryImageFiles.map((file) => uploadToCloudinary(file)))
						: Promise.resolve([]),
				]);
			} catch (err) {
				console.error('Failed to upload project images to Cloudinary', err);
				setErrorMessage('Failed to upload one or more images. Check your Cloudinary configuration and try again.');
				setIsCreating(false);
				return;
			}

			try {
				const payload = buildProjectPayload(trimmedName, coverImage, galleryImages);
				const project = await projectService.createProject(payload);
				setProjects((currentProjects) => [...currentProjects, project]);
				setSelectedProjectId(project.id);
			} catch (err) {
				console.error('Failed to create project via API, falling back to local creation', err);
				const project = createProject(trimmedName, coverImage, galleryImages);
				setProjects((currentProjects) => [...currentProjects, project]);
				setSelectedProjectId(project.id);
			} finally {
				setIsCreating(false);
			}
		}

		setNewProjectName('');
		setCoverImageFile(null);
		setGalleryImageFiles([]);
		setErrorMessage('');
		setNewProjectDialogOpen(false);
	};

	return {
		projects,
		selectedProjectId,
		selectedProject,
		setSelectedProjectId,
		openCreateProjectDialog: () => {
			setErrorMessage('');
			setNewProjectDialogOpen(true);
		},
		dialog: {
			open: newProjectDialogOpen,
			name: newProjectName,
			onNameChange: setNewProjectName,
			onCoverImageChange: handleCoverImageChange,
			onGalleryImagesChange: handleGalleryImagesChange,
			onCreate: handleCreateProject,
			onClose: () => {
				setErrorMessage('');
				setNewProjectDialogOpen(false);
			},
			coverImageFileName: coverImageFile?.name ?? '',
			galleryImageCount: galleryImageFiles.length,
			isCreating,
			errorMessage,
		},
	};
}
