import { Typography } from '@mui/material';
import type { Project } from '@/types/types';

interface ProjectGridProps {
	projects: Project[];
	onSelectProject: (projectId: number) => void;
}

export function ProjectGrid({ projects, onSelectProject }: ProjectGridProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{projects.map((project) => (
				<button
					key={project.id}
					onClick={() => onSelectProject(project.id)}
					className="group text-left bg-white border border-gray-200 hover:border-black transition-all rounded overflow-hidden"
				>
					<div className="relative aspect-square bg-gray-100 overflow-hidden w-full">
						<img src={project.coverImage} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
						<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
					</div>
					<div className="p-4">
						<Typography variant="body2" className="font-bold text-black truncate">
							{project.name}
						</Typography>
						<Typography variant="caption" className="text-gray-500 block mt-1">
							{project.itemCount} item{project.itemCount !== 1 ? 's' : ''}
						</Typography>
						<div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
							<span>Modified</span>
							<span>{project.date}</span>
						</div>
					</div>
				</button>
			))}
		</div>
	);
}
