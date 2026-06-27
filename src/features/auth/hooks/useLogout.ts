import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/constants/query-keys";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => AuthService.logout(),
    onSettled: () => {
      queryClient.setQueryData(queryKeys.auth.currentUser, null);
      queryClient.clear(); // Clear all cached queries to avoid data leaks
    },
  });
}
