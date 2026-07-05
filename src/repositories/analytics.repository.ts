import { apiClient, handleApiError } from "@/lib/api";
import { components } from "@/generated/openapi";
import { apiEndpoints } from "@/config/api";

type ApiResponseOverviewAnalyticsResponse = components["schemas"]["ApiResponseOverviewAnalyticsResponse"];
type ApiResponseTrafficResponse = components["schemas"]["ApiResponseTrafficResponse"];
type ApiResponseListStatEntry = components["schemas"]["ApiResponseListStatEntry"];
type ApiResponseEventTimelineResponse = components["schemas"]["ApiResponseEventTimelineResponse"];
type ApiResponseFunnelAnalyticsResponse = components["schemas"]["ApiResponseFunnelAnalyticsResponse"];
type CreateFunnelRequest = components["schemas"]["CreateFunnelRequest"];
type UpdateFunnelRequest = components["schemas"]["UpdateFunnelRequest"];
type ApiResponseFunnelResponse = components["schemas"]["ApiResponseFunnelResponse"];
type ApiResponseListFunnelResponse = components["schemas"]["ApiResponseListFunnelResponse"];

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

  static async getFunnel(params: {
    projectId: number;
    from: string;
    to: string;
    steps: string[];
  }): Promise<ApiResponseFunnelAnalyticsResponse> {
    try {
      const response = await apiClient.get<ApiResponseFunnelAnalyticsResponse>(
        apiEndpoints.analytics.funnel,
        {
          params,
          paramsSerializer: {
            serialize: (p) => {
              const parts: string[] = [];
              for (const [key, value] of Object.entries(p)) {
                if (value === undefined || value === null) continue;
                if (Array.isArray(value)) {
                  for (const val of value) {
                    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
                  }
                } else {
                  parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
                }
              }
              return parts.join("&");
            },
          },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getFunnels(projectId: number): Promise<ApiResponseListFunnelResponse> {
    try {
      const response = await apiClient.get<ApiResponseListFunnelResponse>(
        apiEndpoints.funnels.base,
        { params: { projectId } }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getFunnelById(id: number): Promise<ApiResponseFunnelResponse> {
    try {
      const response = await apiClient.get<ApiResponseFunnelResponse>(
        apiEndpoints.funnels.detail(id)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async createFunnel(payload: CreateFunnelRequest): Promise<ApiResponseFunnelResponse> {
    try {
      const response = await apiClient.post<ApiResponseFunnelResponse>(
        apiEndpoints.funnels.base,
        payload
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async updateFunnel(id: number, payload: UpdateFunnelRequest): Promise<ApiResponseFunnelResponse> {
    try {
      const response = await apiClient.put<ApiResponseFunnelResponse>(
        apiEndpoints.funnels.detail(id),
        payload
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async deleteFunnel(id: number): Promise<ApiResponseFunnelResponse> {
    try {
      const response = await apiClient.delete<ApiResponseFunnelResponse>(
        apiEndpoints.funnels.detail(id)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
