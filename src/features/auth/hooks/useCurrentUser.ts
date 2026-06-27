import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/constants/query-keys";
import { components } from "@/generated/openapi";

import { AuthStorage } from "@/lib/auth/auth-storage";

type UserResponse = components["schemas"]["UserResponse"];

export function useCurrentUser() {
  return useQuery<UserResponse | null, Error>({
    queryKey: queryKeys.auth.currentUser,
    queryFn: () => {
      const auth = AuthStorage.getAuth();
      return auth?.user || null;
    },
    staleTime: Infinity,
  });
}
