import { components } from "@/generated/openapi";

type AuthResponse = components["schemas"]["AuthResponse"];

const STORAGE_KEY = "insightflow_auth";

export class AuthStorage {
  static saveAuth(auth: AuthResponse): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } catch (error) {
      console.error("Failed to save auth to localStorage", error);
    }
  }

  static getAuth(): AuthResponse | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Failed to read auth from localStorage", error);
      return null;
    }
  }

  static removeAuth(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove auth from localStorage", error);
    }
  }

  static isAuthenticated(): boolean {
    const auth = this.getAuth();
    return !!auth?.accessToken;
  }
}
export type { AuthResponse };
