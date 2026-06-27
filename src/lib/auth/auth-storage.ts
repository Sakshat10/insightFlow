import { TokenStorage, TokenData } from "./token-storage";
import { UserStorage } from "./user-storage";
import { components } from "@/generated/openapi";

type AuthResponse = components["schemas"]["AuthResponse"];
type UserResponse = components["schemas"]["UserResponse"];

export class AuthStorage {
  static login(auth: AuthResponse): void {
    if (!auth) return;

    // Extract tokens
    const tokens: TokenData = {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      expiresIn: auth.expiresIn,
      tokenType: auth.tokenType,
    };
    TokenStorage.saveTokens(tokens);

    // Extract user profile details
    if (auth.user) {
      UserStorage.saveUser(auth.user);
    }
  }

  static logout(): void {
    TokenStorage.clearTokens();
    UserStorage.clearUser();
  }

  static clear(): void {
    TokenStorage.clearTokens();
    UserStorage.clearUser();
  }

  static isAuthenticated(): boolean {
    return TokenStorage.hasToken();
  }

  static getAccessToken(): string | undefined {
    const tokens = TokenStorage.getTokens();
    return tokens?.accessToken;
  }

  static getRefreshToken(): string | undefined {
    const tokens = TokenStorage.getTokens();
    return tokens?.refreshToken;
  }

  static getCurrentUser(): UserResponse | null {
    return UserStorage.getUser();
  }
}
export type { AuthResponse, UserResponse };
