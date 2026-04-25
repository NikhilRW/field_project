import { useQuery } from "@tanstack/react-query";
import { fetchBeneficiaries } from "../utils/api";

export const beneficiariesQueryKey = ["beneficiaries"];

export const useBeneficiaries = () =>
  useQuery({
    queryKey: beneficiariesQueryKey,
    queryFn: fetchBeneficiaries,
  });
