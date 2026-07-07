import { apiClient, handleApiError } from "@/lib/api";
import { components } from "@/generated/openapi";
import { apiEndpoints } from "@/config/api";

type ApiResponseUserResponse = components["schemas"]["ApiResponseUserResponse"];
type UpdateUserRequest = components["schemas"]["UpdateUserRequest"];

export class UserRepository {
  static async getUserById(id: number): Promise<ApiResponseUserResponse> {
    try {
      const response = await apiClient.get<ApiResponseUserResponse>(apiEndpoints.users.detail(id));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async updateUser(id: number, request: UpdateUserRequest): Promise<ApiResponseUserResponse> {
    try {
      const response = await apiClient.put<ApiResponseUserResponse>(apiEndpoints.users.detail(id), request);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
