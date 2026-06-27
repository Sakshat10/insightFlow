import { AuthStorage } from "./auth-storage";
import { components } from "@/generated/openapi";

type UserResponse = components["schemas"]["UserResponse"];

export function getCurrentUser(): UserResponse | null {
  const auth = AuthStorage.getAuth();
  return auth?.user || null;
}

export function getCurrentRole(): string | null {
  const user = getCurrentUser();
  return user?.role || null;
}

export function isAuthenticated(): boolean {
  return AuthStorage.isAuthenticated();
}
export type { UserResponse };
