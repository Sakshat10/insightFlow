import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/constants/query-keys";
import { components } from "@/generated/openapi";

type UserResponse = components["schemas"]["UserResponse"];

export function useCurrentUser() {
  return useQuery<UserResponse, Error>({
    queryKey: queryKeys.auth.currentUser,
    queryFn: () => AuthService.getCurrentUser(),
    retry: false, // Don't infinite retry if 401 unauthenticated
  });
}
