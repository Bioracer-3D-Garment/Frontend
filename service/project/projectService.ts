import type { Project } from "@/types/types";
import { getJwtToken } from "@/service/auth/auth_service";

class ProjectService {
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
    return data as Project[];
  }

  public async createProject(name: string): Promise<Project> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/projects`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Failed to create project");
    }

    const data = await response.json();
    return data as Project;
  }

  public async deleteProject(projectId: number): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (response.status === 204) return;
    if (response.status === 401) throw Object.assign(new Error("Unauthorized"), { status: 401 });
    if (response.status === 403) throw Object.assign(new Error("Forbidden"), { status: 403 });
    if (response.status === 404) throw Object.assign(new Error("Not found"), { status: 404 });
    throw new Error("Failed to delete project");
  }

  public async updateProjectDetails(
    projectId: number,
    project: Project,
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

    return data as Project;
  }
}

export default ProjectService;
