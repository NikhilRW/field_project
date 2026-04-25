import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateActivityStatusMutationKey } from "@/shared/config/tanstack";
import type { ActivityStatus } from "@/shared/types/mock";
import type { ActivityDetail } from "../utils/api";
import { activityDetailQueryKey } from "@/shared/config/queryKeys";

type UpdateActivityStatusVariables = {
  id: string;
  status: ActivityStatus;
};

export const useUpdateActivityStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      id: string;
      name: string;
      date: string;
      volunteers: number;
      status: ActivityStatus;
      description: string;
    },
    Error,
    UpdateActivityStatusVariables
  >({
    mutationKey: updateActivityStatusMutationKey,
    onSuccess: async (updatedActivity, variables) => {
      queryClient.setQueryData(
        activityDetailQueryKey(variables.id),
        (currentData: ActivityDetail | undefined) =>
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
