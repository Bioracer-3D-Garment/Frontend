import { Typography } from "@mui/material";
import { Edit as EditIcon, DeleteOutline as DeleteIcon } from "@mui/icons-material";
import type { Project } from "@/types/types";
import { CldImage } from "next-cloudinary";

function isRenderableUrl(source: string) {
  return (
    source.startsWith("http://") ||
    source.startsWith("https://") ||
    source.startsWith("blob:") ||
    source.startsWith("data:")
  );
}

interface ProjectGridProps {
  projects: Project[];
  onEditProject: (projectId: number) => void;
  onSelectProject: (projectId: number) => void;
  onDeleteProject: (projectId: number) => void;
}

export function ProjectGrid({
  projects,
  onSelectProject,
  onEditProject,
  onDeleteProject,
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
            {project.coverImage && isRenderableUrl(project.coverImage) ? (
              <img
                src={project.coverImage}
                alt={project.name}
                className="h-full w-full object-cover"
              />
            ) : project.coverImage ? (
              <CldImage
                width="300"
                height="300"
                src={project.coverImage}
                alt={project.name}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs font-medium uppercase tracking-widest text-gray-400">
                No cover image
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(project.id);
                }}
                className="p-2 bg-white rounded-full hover:bg-red-700 text-gray-400 hover:text-white transition-colors"
              >
                <DeleteIcon className="w-4 h-4" />
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
            <Typography variant="caption" className="text-gray-500 block mt-1">
              {project.itemCount} item{project.itemCount !== 1 ? "s" : ""}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
