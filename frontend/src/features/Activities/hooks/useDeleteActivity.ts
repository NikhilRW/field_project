import { useMutation } from "@tanstack/react-query";
import { deleteActivityMutationKey } from "@/shared/config/tanstack";
import { activityDetailQueryKey } from "@/shared/config/queryKeys";

export const useDeleteActivity = () => {
  return useMutation<{ id: string }, Error, string>({
    mutationKey: deleteActivityMutationKey,
    onMutate: async (id: string, context) => {
      await context.client.cancelQueries({
        queryKey: activityDetailQueryKey(id),
        exact: true,
      });
      context.client.removeQueries({
        queryKey: activityDetailQueryKey(id),
        exact: true,
      });
    },
  });
};
