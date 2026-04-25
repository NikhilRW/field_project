import http from "@/shared/utils/http";
import type { Beneficiary } from "@/shared/types/mock";
import type { Category, Gender, HealthStatus } from "../types/form";

export type CreateBeneficiaryPayload = {
  name: string;
  age: number;
  gender: Gender;
  category: Category;
  address: string;
  healthStatus: HealthStatus;
};

export const createBeneficiary = async (payload: CreateBeneficiaryPayload) => {
  const response = await http.post<{ success: boolean; data: Beneficiary }>(
    "/api/beneficiaries",
    payload,
  );
  return response.data.data;
};

export const fetchBeneficiaries = async () => {
  const response = await http.get<{ success: boolean; data: Beneficiary[] }>(
    "/api/beneficiaries",
  );
  return response.data.data;
};
