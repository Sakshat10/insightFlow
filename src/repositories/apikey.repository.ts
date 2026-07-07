import { apiClient, handleApiError } from "@/lib/api";
import { components } from "@/generated/openapi";
import { apiEndpoints } from "@/config/api";

type CreateApiKeyRequest = components["schemas"]["CreateApiKeyRequest"];
type ApiResponseApiKeyCreatedResponse = components["schemas"]["ApiResponseApiKeyCreatedResponse"];
type ApiResponseApiKeyResponse = components["schemas"]["ApiResponseApiKeyResponse"];
type ApiResponseListApiKeyResponse = components["schemas"]["ApiResponseListApiKeyResponse"];
type ApiResponseApiKeyStatsResponse = components["schemas"]["ApiResponseApiKeyStatsResponse"];

export class ApiKeyRepository {
  static async getApiKeys(projectId: number): Promise<ApiResponseListApiKeyResponse> {
    try {
      const response = await apiClient.get<ApiResponseListApiKeyResponse>(
        apiEndpoints.apiKeys.base,
        { params: { projectId } }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getApiKeyById(id: number): Promise<ApiResponseApiKeyResponse> {
    try {
      const response = await apiClient.get<ApiResponseApiKeyResponse>(
        apiEndpoints.apiKeys.detail(id)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getApiKeyStats(projectId: number): Promise<ApiResponseApiKeyStatsResponse> {
    try {
      const response = await apiClient.get<ApiResponseApiKeyStatsResponse>(
        apiEndpoints.apiKeys.stats,
        { params: { projectId } }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async createApiKey(payload: CreateApiKeyRequest): Promise<ApiResponseApiKeyCreatedResponse> {
    try {
      const response = await apiClient.post<ApiResponseApiKeyCreatedResponse>(
        apiEndpoints.apiKeys.base,
        payload
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async rotateApiKey(id: number): Promise<ApiResponseApiKeyCreatedResponse> {
    try {
      const response = await apiClient.post<ApiResponseApiKeyCreatedResponse>(
        apiEndpoints.apiKeys.rotate(id)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async revokeApiKey(id: number): Promise<ApiResponseApiKeyResponse> {
    try {
      const response = await apiClient.post<ApiResponseApiKeyResponse>(
        apiEndpoints.apiKeys.revoke(id)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
