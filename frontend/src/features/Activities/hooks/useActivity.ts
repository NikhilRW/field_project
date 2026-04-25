import { Alert } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";
import type { ActivityStatus } from "@/shared/types/mock";
import { fetchActivityById } from "../utils/api";
import { useDeleteActivity } from "./useDeleteActivity";
import { useUpdateActivityStatus } from "./useUpdateActivityStatus";
import { activityDetailQueryKey } from "@/shared/config/queryKeys";


export const useActivity = (id: string) => {

  const activityQuery = useQuery({
    queryKey: activityDetailQueryKey(id),
    queryFn: () => fetchActivityById(id),
    enabled: Boolean(id),
  });

  const deleteActivityMutation = useDeleteActivity();
  const updateActivityStatusMutation = useUpdateActivityStatus();

  const handleDelete = () => {
    const activityId = activityQuery.data?.id;

    if (!activityId || deleteActivityMutation.isPending) {
      return;
    }

    Alert.alert(
      "Delete activity?",
      "This will permanently remove the activity and its volunteer assignments.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteActivityMutation.mutateAsync(activityId);
              showMessage({
                message: "Activity deleted",
                description: "The activity has been removed successfully.",
                type: "success",
              });
              router.back();
            } catch (error: any) {
              showMessage({
                message: "Unable to delete activity",
                description:
                  error?.message ??
                  "Please try again once your connection is stable.",
                type: "danger",
              });
            }
          },
        },
      ],
    );
  };

  const handleStatusChange = async (status: ActivityStatus) => {
    const activityId = activityQuery.data?.id;
    const currentStatus = activityQuery.data?.status;

    if (
      !activityId ||
      !currentStatus ||
      currentStatus === status ||
      updateActivityStatusMutation.isPending
    ) {
      return;
    }

    try {
      await updateActivityStatusMutation.mutateAsync({
        id: activityId,
        status,
      });
      showMessage({
        message: "Activity updated",
        description: `Status changed to ${status}.`,
        type: "success",
      });
    } catch (error: any) {
      showMessage({
        message: "Unable to update activity",
        description:
          error?.message ?? "Please try again once your connection is stable.",
        type: "danger",
      });
    }
  };

  return {
    ...activityQuery,
    handleDelete,
    handleStatusChange,
    isDeleting: deleteActivityMutation.isPending,
    isUpdatingStatus: updateActivityStatusMutation.isPending,
  };
};
