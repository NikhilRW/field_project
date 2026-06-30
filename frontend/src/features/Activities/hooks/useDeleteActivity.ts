import { useMutation } from "@tanstack/react-query";
import { deleteActivityMutationKey } from "@/shared/config/tanstack";
import { activityDetailQueryKey } from "@/shared/config/queryKeys";

export const useDeleteActivity = () => {
  return useMutation<{ id: string }, Error, string>({
    mutationKey: deleteActivityMutationKey,
    onSuccess: async (_data, id, _onMutateResult, context) => {
      await context.client.cancelQueries({
        queryKey: activityDetailQueryKey(id),
      });
      context.client.removeQueries({
        queryKey: activityDetailQueryKey(id),
      });
    },
  });
};
