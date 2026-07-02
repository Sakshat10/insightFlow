import { apiClient, handleApiError } from "@/lib/api";
import { components } from "@/generated/openapi";
import { apiEndpoints } from "@/config/api";

type ApiResponsePagedResponseProjectResponse = components["schemas"]["ApiResponsePagedResponseProjectResponse"];
type ApiResponseProjectResponse = components["schemas"]["ApiResponseProjectResponse"];
type ApiResponseProjectStatsResponse = components["schemas"]["ApiResponseProjectStatsResponse"];
type CreateProjectRequest = components["schemas"]["CreateProjectRequest"];

export class ProjectRepository {
  static async getProjects(): Promise<ApiResponsePagedResponseProjectResponse> {
    try {
      const response = await apiClient.get<ApiResponsePagedResponseProjectResponse>(apiEndpoints.projects.base);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getProjectById(id: number): Promise<ApiResponseProjectResponse> {
    try {
      const response = await apiClient.get<ApiResponseProjectResponse>(apiEndpoints.projects.detail(id));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getProjectStats(): Promise<ApiResponseProjectStatsResponse> {
    try {
      const response = await apiClient.get<ApiResponseProjectStatsResponse>(apiEndpoints.projects.stats);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async createProject(request: CreateProjectRequest): Promise<ApiResponseProjectResponse> {
    try {
      const response = await apiClient.post<ApiResponseProjectResponse>(apiEndpoints.projects.base, request);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
