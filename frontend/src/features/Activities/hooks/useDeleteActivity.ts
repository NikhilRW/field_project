import { useMutation } from "@tanstack/react-query";
import { deleteActivityMutationKey } from "@/shared/config/tanstack";

export const useDeleteActivity = () => {
  return useMutation<{ id: string }, Error, string>({
    mutationKey: deleteActivityMutationKey,
  });
};
