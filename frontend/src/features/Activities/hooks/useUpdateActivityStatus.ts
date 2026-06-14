import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateActivityStatusMutationKey } from "@/shared/config/tanstack";
import type { Activity, ActivityStatus } from "@/shared/types/mock";
import { activityDetailQueryKey } from "@/shared/config/queryKeys";

type UpdateActivityStatusVariables = {
  id: string;
  status: ActivityStatus;
};

export const useUpdateActivityStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Activity,
    Error,
    UpdateActivityStatusVariables
  >({
    mutationKey: updateActivityStatusMutationKey,
    onSuccess: async (updatedActivity, variables) => {
      queryClient.setQueryData(
        activityDetailQueryKey(variables.id),
        (currentData: Activity | undefined) =>
          currentData
            ? {
                ...currentData,
                status: updatedActivity.status,
              }
            : currentData,
      );
    },
  });
};
