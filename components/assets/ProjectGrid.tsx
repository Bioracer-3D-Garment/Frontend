import { Typography } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import type { Project } from "@/types/types";
import { CldImage } from "next-cloudinary";

interface ProjectGridProps {
  projects: Project[];
  onEditProject: (projectId: number) => void;
  onSelectProject: (projectId: number) => void;
}

export function ProjectGrid({
  projects,
  onSelectProject,
  onEditProject,
}: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          role="button"
          tabIndex={0}
          onClick={() => onSelectProject(project.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectProject(project.id);
            }
          }}
          className="group text-left bg-white border border-gray-200 transition-all rounded overflow-hidden cursor-pointer"
        >
          <div className="relative aspect-square bg-gray-100 overflow-hidden w-full">
            {project.coverImage ? (
              <CldImage
                width="300"
                height="300"
                src={project.coverImage}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-extrabold uppercase select-none">
                {project.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProject(project.id);
                }}
                className="p-2 bg-white rounded-full hover:bg-[#e2001a] text-gray-700 hover:text-white transition-colors"
              >
                <EditIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <Typography
              variant="body2"
              className="font-bold text-black truncate"
            >
              {project.name}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
