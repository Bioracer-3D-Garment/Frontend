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

  public async getUserProjects(): Promise<Project[]> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/user`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user projects");
    }

    return response.json() as Promise<Project[]>;
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

  public async updateProjectDetails(
    projectId: number,
    input: { name: string; coverImage: string },
  ): Promise<Project> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("Failed to update project");
    }

    return response.json() as Promise<Project>;
  }

  public async deleteProject(projectId: number): Promise<void> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Delete project failed:", {
        status: response.status,
        body: errorText,
      });

      throw new Error("Failed to delete project");
    }
  }
}

export default ProjectService;
