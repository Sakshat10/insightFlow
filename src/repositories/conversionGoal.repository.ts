import { apiClient, handleApiError } from "@/lib/api";
import { components } from "@/generated/openapi";
import { apiEndpoints } from "@/config/api";

type ApiResponseListConversionGoalResponse = components["schemas"]["ApiResponseListConversionGoalResponse"];
type ApiResponseConversionGoalResponse = components["schemas"]["ApiResponseConversionGoalResponse"];
type ApiResponseListDailyConversionResponse = components["schemas"]["ApiResponseListDailyConversionResponse"];
type CreateConversionGoalRequest = components["schemas"]["CreateConversionGoalRequest"];
type UpdateConversionGoalRequest = components["schemas"]["UpdateConversionGoalRequest"];

export class ConversionGoalRepository {
  static async getConversionGoals(projectId: number): Promise<ApiResponseListConversionGoalResponse> {
    try {
      const response = await apiClient.get<ApiResponseListConversionGoalResponse>(
        apiEndpoints.conversionGoals.base,
        { params: { projectId } }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getConversionGoalById(id: number): Promise<ApiResponseConversionGoalResponse> {
    try {
      const response = await apiClient.get<ApiResponseConversionGoalResponse>(
        apiEndpoints.conversionGoals.detail(id)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async createConversionGoal(request: CreateConversionGoalRequest): Promise<ApiResponseConversionGoalResponse> {
    try {
      const response = await apiClient.post<ApiResponseConversionGoalResponse>(
        apiEndpoints.conversionGoals.base,
        request
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async updateConversionGoal(id: number, request: UpdateConversionGoalRequest): Promise<ApiResponseConversionGoalResponse> {
    try {
      const response = await apiClient.patch<ApiResponseConversionGoalResponse>(
        apiEndpoints.conversionGoals.detail(id),
        request
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async deactivateConversionGoal(id: number): Promise<ApiResponseConversionGoalResponse> {
    try {
      const response = await apiClient.delete<ApiResponseConversionGoalResponse>(
        apiEndpoints.conversionGoals.detail(id)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getConversionAnalytics(projectId: number, days?: number): Promise<ApiResponseListDailyConversionResponse> {
    try {
      const response = await apiClient.get<ApiResponseListDailyConversionResponse>(
        apiEndpoints.analytics.conversions,
        { params: { projectId, days } }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
export type { ApiResponseListConversionGoalResponse, ApiResponseConversionGoalResponse, ApiResponseListDailyConversionResponse };
