import { ApiKeyRepository } from "@/repositories/apikey.repository";
import { components } from "@/generated/openapi";

type CreateApiKeyRequest = components["schemas"]["CreateApiKeyRequest"];
type ApiKeyResponse = components["schemas"]["ApiKeyResponse"];
type ApiKeyCreatedResponse = components["schemas"]["ApiKeyCreatedResponse"];
type ApiKeyStatsResponse = components["schemas"]["ApiKeyStatsResponse"];

export class ApiKeyService {
  static async getApiKeys(projectId: number): Promise<ApiKeyResponse[]> {
    const res = await ApiKeyRepository.getApiKeys(projectId);
    return res?.data || [];
  }

  static async getApiKeyById(id: number): Promise<ApiKeyResponse> {
    const res = await ApiKeyRepository.getApiKeyById(id);
    if (!res?.data) {
      throw new Error(res?.message || `Failed to fetch API key ${id}`);
    }
    return res.data;
  }

  static async getApiKeyStats(projectId: number): Promise<ApiKeyStatsResponse> {
    const res = await ApiKeyRepository.getApiKeyStats(projectId);
    if (!res?.data) {
      throw new Error(res?.message || "Failed to fetch API key stats");
    }
    return res.data;
  }

  static async createApiKey(payload: CreateApiKeyRequest): Promise<ApiKeyCreatedResponse> {
    const res = await ApiKeyRepository.createApiKey(payload);
    if (!res?.data) {
      throw new Error(res?.message || "Failed to create API key");
    }
    return res.data;
  }

  static async rotateApiKey(id: number): Promise<ApiKeyCreatedResponse> {
    const res = await ApiKeyRepository.rotateApiKey(id);
    if (!res?.data) {
      throw new Error(res?.message || "Failed to rotate API key");
    }
    return res.data;
  }

  static async revokeApiKey(id: number): Promise<ApiKeyResponse> {
    const res = await ApiKeyRepository.revokeApiKey(id);
    if (!res?.data) {
      throw new Error(res?.message || "Failed to revoke API key");
    }
    return res.data;
  }
}
