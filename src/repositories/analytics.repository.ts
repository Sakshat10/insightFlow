import { apiClient, handleApiError } from "@/lib/api";
import { components } from "@/generated/openapi";
import { apiEndpoints } from "@/config/api";

type ApiResponseOverviewAnalyticsResponse = components["schemas"]["ApiResponseOverviewAnalyticsResponse"];
type ApiResponseTrafficResponse = components["schemas"]["ApiResponseTrafficResponse"];
type ApiResponseListStatEntry = components["schemas"]["ApiResponseListStatEntry"];
type ApiResponseEventTimelineResponse = components["schemas"]["ApiResponseEventTimelineResponse"];

export class AnalyticsRepository {
  static async getEventTimeline(params: {
    projectId: number;
    from: string;
    to: string;
  }): Promise<ApiResponseEventTimelineResponse> {
    try {
      const response = await apiClient.get<ApiResponseEventTimelineResponse>(
        apiEndpoints.analytics.eventTimeline,
        { params }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getOverview(projectId: number): Promise<ApiResponseOverviewAnalyticsResponse> {
    try {
      const response = await apiClient.get<ApiResponseOverviewAnalyticsResponse>(apiEndpoints.analytics.overview, {
        params: { projectId },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getTraffic(projectId: number, days?: number): Promise<ApiResponseTrafficResponse> {
    try {
      const response = await apiClient.get<ApiResponseTrafficResponse>(apiEndpoints.analytics.traffic, {
        params: { projectId, days },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getCountries(projectId: number): Promise<ApiResponseListStatEntry> {
    try {
      const response = await apiClient.get<ApiResponseListStatEntry>(apiEndpoints.analytics.countries, {
        params: { projectId },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getDevices(projectId: number): Promise<ApiResponseListStatEntry> {
    try {
      const response = await apiClient.get<ApiResponseListStatEntry>(apiEndpoints.analytics.devices, {
        params: { projectId },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getBrowsers(projectId: number): Promise<ApiResponseListStatEntry> {
    try {
      const response = await apiClient.get<ApiResponseListStatEntry>(apiEndpoints.analytics.browsers, {
        params: { projectId },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getReferrers(projectId: number): Promise<ApiResponseListStatEntry> {
    try {
      const response = await apiClient.get<ApiResponseListStatEntry>(apiEndpoints.analytics.referrers, {
        params: { projectId },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getTopPages(projectId: number, limit?: number): Promise<ApiResponseListStatEntry> {
    try {
      const response = await apiClient.get<ApiResponseListStatEntry>(apiEndpoints.analytics.topPages, {
        params: { projectId, limit },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getSessions(projectId: number): Promise<ApiResponseListStatEntry> {
    try {
      const response = await apiClient.get<ApiResponseListStatEntry>(apiEndpoints.analytics.sessions, {
        params: { projectId },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getEvents(projectId: number, limit?: number): Promise<ApiResponseListStatEntry> {
    try {
      const response = await apiClient.get<ApiResponseListStatEntry>(apiEndpoints.analytics.events, {
        params: { projectId, limit },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getSessionList(projectId: number, page?: number, size?: number): Promise<components["schemas"]["ApiResponsePagedResponseSessionResponse"]> {
    try {
      const response = await apiClient.get<components["schemas"]["ApiResponsePagedResponseSessionResponse"]>(apiEndpoints.sessions.base, {
        params: { projectId, page, size },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getEventList(projectId: number, page?: number, size?: number): Promise<components["schemas"]["ApiResponsePagedResponseEventResponse"]> {
    try {
      const response = await apiClient.get<components["schemas"]["ApiResponsePagedResponseEventResponse"]>(apiEndpoints.events.base, {
        params: { projectId, page, size },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
