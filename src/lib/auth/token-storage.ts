import { AUTH_STORAGE_KEYS } from "./auth-constants";

export interface TokenData {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

export class TokenStorage {
  static saveTokens(tokens: TokenData): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
    } catch (error) {
      console.error("Failed to save tokens to localStorage", error);
    }
  }

  static getTokens(): TokenData | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(AUTH_STORAGE_KEYS.TOKENS);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Failed to read tokens from localStorage", error);
      return null;
    }
  }

  static updateAccessToken(accessToken: string): void {
    if (typeof window === "undefined") return;
    const tokens = this.getTokens() || {};
    this.saveTokens({ ...tokens, accessToken });
  }

  static clearTokens(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKENS);
    } catch (error) {
      console.error("Failed to clear tokens from localStorage", error);
    }
  }

  static hasToken(): boolean {
    const tokens = this.getTokens();
    return !!tokens?.accessToken;
  }
}
