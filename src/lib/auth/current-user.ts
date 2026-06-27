import { AuthStorage } from "./auth-storage";
import { components } from "@/generated/openapi";

type UserResponse = components["schemas"]["UserResponse"];

export function getCurrentUser(): UserResponse | null {
  return AuthStorage.getCurrentUser();
}

export function getCurrentRole(): string | null {
  const user = getCurrentUser();
  return user?.role || null;
}

export function isAdmin(): boolean {
  const role = getCurrentRole();
  return role === "ADMIN";
}

export function isAuthenticated(): boolean {
  return AuthStorage.isAuthenticated();
}
export type { UserResponse };

