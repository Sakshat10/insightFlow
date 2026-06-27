import { AuthRepository } from "@/repositories/auth.repository";
import { components } from "@/generated/openapi";

type LoginRequest = components["schemas"]["LoginRequest"];
type RegisterRequest = components["schemas"]["RegisterRequest"];
type RefreshTokenRequest = components["schemas"]["RefreshTokenRequest"];
type UserResponse = components["schemas"]["UserResponse"];
type AuthResponse = components["schemas"]["AuthResponse"];

import { AuthStorage } from "@/lib/auth/auth-storage";

export class AuthService {
  static async login(request: LoginRequest): Promise<AuthResponse> {
    const result = await AuthRepository.login(request);
    if (!result?.data) {
      throw new Error(result?.message || "Login failed");
    }
    AuthStorage.saveAuth(result.data);
    return result.data;
  }

  static async register(request: RegisterRequest): Promise<AuthResponse> {
    const result = await AuthRepository.register(request);
    if (!result?.data) {
      throw new Error(result?.message || "Registration failed");
    }
    AuthStorage.saveAuth(result.data);
    return result.data;
  }

  static async logout(): Promise<void> {
    const result = await AuthRepository.logout();
    if (result?.success === false) {
      throw new Error(result?.message || "Logout failed");
    }
    AuthStorage.removeAuth();
  }

  static async getCurrentUser(): Promise<UserResponse> {
    const result = await AuthRepository.getCurrentUser();
    if (!result?.data) {
      throw new Error(result?.message || "Failed to fetch current user");
    }
    return result.data;
  }

  static async refreshToken(request: RefreshTokenRequest): Promise<AuthResponse> {
    const result = await AuthRepository.refreshToken(request);
    if (!result?.data) {
      throw new Error(result?.message || "Token refresh failed");
    }
    return result.data;
  }
}
