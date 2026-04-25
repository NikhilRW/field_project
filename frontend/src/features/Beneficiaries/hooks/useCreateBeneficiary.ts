import { useMutation } from "@tanstack/react-query";
import { createBeneficiaryMutationKey } from "@/shared/config/tanstack";
import type { CreateBeneficiaryPayload } from "../utils/api";

export const useCreateBeneficiary = () =>
  useMutation<unknown, Error, CreateBeneficiaryPayload>({
    mutationKey: createBeneficiaryMutationKey,
  });
