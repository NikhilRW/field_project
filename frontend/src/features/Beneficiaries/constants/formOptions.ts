import type { Category, Gender, HealthStatus } from "../types/form";

export const beneficiaryGenders: Gender[] = ["Male", "Female", "Other"];
export const beneficiaryCategories: Category[] = [
  "Elderly",
  "Children",
  "Youth",
  "PWD",
  "Mothers",
];
export const beneficiaryHealthOptions: HealthStatus[] = [
  "Good",
  "Moderate",
  "Critical",
];
