import type { Project, ProjectSavePayload } from "@/types/types";
import { getJwtToken } from "@/service/auth/auth_service";

class ProjectService {
  private normalizeProject(project: Partial<Project>): Project {
    return {
      id: project.id ?? 0,
      name: project.name ?? "",
      date: project.date ?? "",
      itemCount: project.itemCount ?? 0,
      coverImage: project.coverImage ?? "",
      galleryImages: project.galleryImages ?? [],
    };
  }

  private getAuthHeaders() {
    const token = getJwtToken();

    if (!token) {
      throw new Error("JWT token is not set");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  public async getAllProjects(): Promise<Project[]> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/projects`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    const data = await response.json();
    return (data as Partial<Project>[]).map((project) => this.normalizeProject(project));
  }

  public async createProject(payload: ProjectSavePayload): Promise<Project> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/projects`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create project");
    }

    const data = await response.json();
    return this.normalizeProject(data as Partial<Project>);
  }

  public async deleteProject(projectId: number): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok && response.status !== 204) throw new Error("Failed to delete project");
  }

  public async updateProjectDetails(
    projectId: number,
    project: ProjectSavePayload,
  ): Promise<Project> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      // send the project object directly (server typically expects the resource body),
      // not wrapped inside a `project` key
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error("Failed to update project");
    }

    const data = await response.json();

    return this.normalizeProject(data as Partial<Project>);
  }
}

export default ProjectService;
