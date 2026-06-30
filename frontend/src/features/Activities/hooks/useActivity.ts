import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";
import type { ActivityStatus } from "@/shared/types/mock";
import { fetchActivityById } from "../utils/api";
import { useDeleteActivity } from "./useDeleteActivity";
import { useUpdateActivityStatus } from "./useUpdateActivityStatus";
import { activitiesQueryKey } from "./useActivities";
import { activityDetailQueryKey } from "@/shared/config/queryKeys";

export const useActivity = (id: string) => {
  const queryClient = useQueryClient();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const deleteActivityMutation = useDeleteActivity();

  const activityQuery = useQuery({
    queryKey: activityDetailQueryKey(id),
    queryFn: () => fetchActivityById(id),
    enabled: () => !!id && deleteModalVisible === false,
  });

  const updateActivityStatusMutation = useUpdateActivityStatus();

  const openDeleteModal = () => setDeleteModalVisible(true);
  const closeDeleteModal = () => setDeleteModalVisible(false);

  const handleDelete = async () => {
    const activityId = activityQuery.data?.id;

    if (!activityId || deleteActivityMutation.isPending) {
      return;
    }

    try {
      await deleteActivityMutation.mutateAsync(activityId);
      queryClient.invalidateQueries({ queryKey: activitiesQueryKey });
      showMessage({
        message: "Activity deleted",
        description: "The activity has been removed successfully.",
        type: "success",
      });
      router.push("/(tabs)/activities");
    } catch (error: any) {
      showMessage({
        message: "Unable to delete activity",
        description:
          error?.message ?? "Please try again once your connection is stable.",
        type: "danger",
      });
    }
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
    deleteModalVisible,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
    handleStatusChange,
    isDeleting: deleteActivityMutation.isPending,
    isUpdatingStatus: updateActivityStatusMutation.isPending,
  };
};
