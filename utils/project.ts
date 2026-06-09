import type { Project } from "@/types/types";

export function createProject(name: string): Project {
  return {
    name,
    coverImage: "",
  };
}
