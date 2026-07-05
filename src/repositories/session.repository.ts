import { apiClient, handleApiError } from "@/lib/api";
import { components } from "@/generated/openapi";
import { apiEndpoints } from "@/config/api";

type ApiResponsePagedResponseSessionResponse = components["schemas"]["ApiResponsePagedResponseSessionResponse"];
type ApiResponseSessionResponse = components["schemas"]["ApiResponseSessionResponse"];

export class SessionRepository {
  static async getSessions(params: {
    projectId: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<ApiResponsePagedResponseSessionResponse> {
    try {
      const response = await apiClient.get<ApiResponsePagedResponseSessionResponse>(
        apiEndpoints.sessions.base,
        { params }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getSessionById(id: number): Promise<ApiResponseSessionResponse> {
    try {
      const response = await apiClient.get<ApiResponseSessionResponse>(
        apiEndpoints.sessions.detail(String(id))
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
