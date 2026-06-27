import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/constants/query-keys";
import { components } from "@/generated/openapi";

type RegisterRequest = components["schemas"]["RegisterRequest"];
type AuthResponse = components["schemas"]["AuthResponse"];

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (request) => AuthService.register(request),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.currentUser, data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
  });
}
