import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/constants/query-keys";
import { components } from "@/generated/openapi";

type LoginRequest = components["schemas"]["LoginRequest"];
type AuthResponse = components["schemas"]["AuthResponse"];

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (request) => AuthService.login(request),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.currentUser, data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
  });
}
