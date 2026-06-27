import { AUTH_STORAGE_KEYS } from "./auth-constants";
import { components } from "@/generated/openapi";

type UserResponse = components["schemas"]["UserResponse"];

export class UserStorage {
  static saveUser(user: UserResponse): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  }

  static getUser(): UserResponse | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Failed to read user from localStorage", error);
      return null;
    }
  }

  static updateUser(updates: Partial<UserResponse>): void {
    if (typeof window === "undefined") return;
    const user = this.getUser() || {};
    this.saveUser({ ...user, ...updates });
  }

  static clearUser(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    } catch (error) {
      console.error("Failed to clear user from localStorage", error);
    }
  }
}
