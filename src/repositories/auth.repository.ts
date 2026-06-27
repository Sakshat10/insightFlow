import { apiClient, handleApiError } from "@/lib/api";
import { components } from "@/generated/openapi";
import { apiEndpoints } from "@/config/api";

type LoginRequest = components["schemas"]["LoginRequest"];
type RegisterRequest = components["schemas"]["RegisterRequest"];
type RefreshTokenRequest = components["schemas"]["RefreshTokenRequest"];
type AuthResponse = components["schemas"]["ApiResponseAuthResponse"];
type UserResponse = components["schemas"]["ApiResponseUserResponse"];
type VoidResponse = components["schemas"]["ApiResponseVoid"];

export class AuthRepository {
  static async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(apiEndpoints.auth.login, request);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(apiEndpoints.auth.register, request);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async logout(): Promise<VoidResponse> {
    try {
      const response = await apiClient.post<VoidResponse>(apiEndpoints.auth.logout);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await apiClient.get<UserResponse>(apiEndpoints.auth.me);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  static async refreshToken(request: RefreshTokenRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(apiEndpoints.auth.refreshToken, request);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
