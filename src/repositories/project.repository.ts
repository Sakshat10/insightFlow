import { apiClient, handleApiError } from "@/lib/api";
import { components } from "@/generated/openapi";
import { apiEndpoints } from "@/config/api";

type ApiResponsePagedResponseProjectResponse = components["schemas"]["ApiResponsePagedResponseProjectResponse"];
type ApiResponseProjectResponse = components["schemas"]["ApiResponseProjectResponse"];
type ApiResponseProjectStatsResponse = components["schemas"]["ApiResponseProjectStatsResponse"];
type CreateProjectRequest = components["schemas"]["CreateProjectRequest"];
type ApiResponseProjectSettingsResponse = components["schemas"]["ApiResponseProjectSettingsResponse"];
type ProjectSettingsRequest = components["schemas"]["ProjectSettingsRequest"];
type UpdateProjectRequest = components["schemas"]["UpdateProjectRequest"];

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

  static async getProjectSettings(id: number): Promise<ApiResponseProjectSettingsResponse> {
    try {
      const response = await apiClient.get<ApiResponseProjectSettingsResponse>(apiEndpoints.projects.settings(id));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async updateProjectSettings(id: number, request: ProjectSettingsRequest): Promise<ApiResponseProjectSettingsResponse> {
    try {
      const response = await apiClient.put<ApiResponseProjectSettingsResponse>(apiEndpoints.projects.settings(id), request);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async updateProject(id: number, request: UpdateProjectRequest): Promise<ApiResponseProjectResponse> {
    try {
      const response = await apiClient.put<ApiResponseProjectResponse>(apiEndpoints.projects.detail(id), request);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async restoreProject(id: number): Promise<ApiResponseProjectResponse> {
    try {
      const response = await apiClient.put<ApiResponseProjectResponse>(`${apiEndpoints.projects.detail(id)}/restore`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async deleteProject(id: number): Promise<any> {
    try {
      const response = await apiClient.delete<any>(apiEndpoints.projects.detail(id));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
