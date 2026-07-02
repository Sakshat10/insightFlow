import { ProjectRepository } from "@/repositories/project.repository";
import { components } from "@/generated/openapi";

type ProjectResponse = components["schemas"]["ProjectResponse"];
type ProjectStatsResponse = components["schemas"]["ProjectStatsResponse"];

export interface FrontProject {
  id: number;
  name: string;
  domain: string;
  status: "active" | "inactive";
  plan: string;
  tracking: "verified" | "pending";
  lastActivity: string;
  color: string;
  visitors: number;
  conversionRate: number;
  trackingKey: string;
}

const PALETTE = ["#4F81F7", "#64B587", "#F59E0B", "#A78BFA", "#FB923C", "#2DD4BF"];

function getProjectColor(id: number): string {
  return PALETTE[id % PALETTE.length];
}

type CreateProjectRequest = components["schemas"]["CreateProjectRequest"];

export class ProjectService {
  static async getProjects(): Promise<FrontProject[]> {
    const response = await ProjectRepository.getProjects();
    const content = response?.data?.content || [];
    
    return content.map((p) => {
      const id = p.id || 0;
      return {
        id,
        name: p.projectName || "Unnamed Project",
        domain: p.domain || "unknown.com",
        status: p.projectStatus === 1 ? "active" : "inactive",
        plan: "Growth", // fallback
        tracking: p.trackingKey ? "verified" : "pending",
        lastActivity: "Active",
        color: getProjectColor(id),
        visitors: 0, // dynamic visitor count can be loaded from stats or defaults
        conversionRate: 0,
        trackingKey: p.trackingKey || "",
      };
    });
  }

  static async getProjectById(id: number): Promise<FrontProject> {
    const response = await ProjectRepository.getProjectById(id);
    const p = response?.data;
    if (!p) {
      throw new Error("Project not found");
    }
    
    return {
      id: p.id || id,
      name: p.projectName || "Unnamed Project",
      domain: p.domain || "unknown.com",
      status: p.projectStatus === 1 ? "active" : "inactive",
      plan: "Growth",
      tracking: p.trackingKey ? "verified" : "pending",
      lastActivity: "Active",
      color: getProjectColor(p.id || id),
      visitors: 0,
      conversionRate: 0,
      trackingKey: p.trackingKey || "",
    };
  }

  static async getProjectStats(): Promise<ProjectStatsResponse> {
    const response = await ProjectRepository.getProjectStats();
    if (!response?.data) {
      throw new Error("Stats not available");
    }
    return response.data;
  }

  static async createProject(request: CreateProjectRequest): Promise<FrontProject> {
    const response = await ProjectRepository.createProject(request);
    const p = response?.data;
    if (!p) {
      throw new Error(response?.message || "Failed to create project");
    }
    return {
      id: p.id || 0,
      name: p.projectName || "Unnamed Project",
      domain: p.domain || "unknown.com",
      status: p.projectStatus === 1 ? "active" : "inactive",
      plan: "Growth",
      tracking: p.trackingKey ? "verified" : "pending",
      lastActivity: "Just created",
      color: getProjectColor(p.id || 0),
      visitors: 0,
      conversionRate: 0,
      trackingKey: p.trackingKey || "",
    };
  }
}
export type { ProjectStatsResponse };
