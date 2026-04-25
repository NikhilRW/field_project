import { useMutation } from "@tanstack/react-query";
import { createActivityMutationKey } from "@/shared/config/tanstack";
import type { CreateActivityPayload } from "../utils/api";

export const useCreateActivity = () => {
  return useMutation<unknown, Error, CreateActivityPayload>({
    mutationKey: createActivityMutationKey,
  });
};
