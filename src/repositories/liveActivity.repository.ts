import { apiClient, handleApiError } from "@/lib/api";
import { components } from "@/generated/openapi";
import { apiEndpoints } from "@/config/api";

type ApiResponseListLiveActivityResponse = components["schemas"]["ApiResponseListLiveActivityResponse"];

export class LiveActivityRepository {
  static async getRecentActivity(projectId: number, limit?: number): Promise<ApiResponseListLiveActivityResponse> {
    try {
      const response = await apiClient.get<ApiResponseListLiveActivityResponse>(
        apiEndpoints.liveActivity.base,
        { params: { projectId, limit } }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
export type { ApiResponseListLiveActivityResponse };
