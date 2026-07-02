import { apiClient, handleApiError } from "@/lib/api";
import { components } from "@/generated/openapi";
import { apiEndpoints } from "@/config/api";

type ApiResponsePagedResponseEventResponse = components["schemas"]["ApiResponsePagedResponseEventResponse"];
type ApiResponseEventResponse = components["schemas"]["ApiResponseEventResponse"];

export class EventRepository {
  static async getEvents(params: {
    projectId: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<ApiResponsePagedResponseEventResponse> {
    try {
      const response = await apiClient.get<ApiResponsePagedResponseEventResponse>(
        apiEndpoints.events.base,
        { params }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getEventById(id: number): Promise<ApiResponseEventResponse> {
    try {
      const response = await apiClient.get<ApiResponseEventResponse>(
        `${apiEndpoints.events.base}/${id}`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
