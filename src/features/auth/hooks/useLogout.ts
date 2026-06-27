import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/constants/query-keys";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.currentUser, null);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
      queryClient.clear(); // Clear all cached queries to avoid data leaks
    },
  });
}
