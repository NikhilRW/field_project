import { Colors } from "@/shared/constants/color";
import type { BeneficiaryCategory, HealthStatus } from "@/shared/types/mock";

export const getHealthColor = (status: HealthStatus) => {
  if (status === "Good") return Colors.secondary;
  if (status === "Moderate") return Colors.accent;
  return Colors.error;
};

export const getHealthBg = (status: HealthStatus) => {
  if (status === "Good") return Colors.secondaryLight;
  if (status === "Moderate") return Colors.accentLight;
  return Colors.errorLight;
};

export const getCategoryColor = (category: BeneficiaryCategory) => {
  const map: Record<BeneficiaryCategory, string> = {
    Elderly: "#0D5C91",
    Children: "#1D9E54",
    Youth: "#0891B2",
    PWD: "#7C3AED",
    Mothers: "#DB2777",
  };
  return map[category] ?? Colors.primary;
};

export const getCategoryBg = (category: BeneficiaryCategory) => {
  const map: Record<BeneficiaryCategory, string> = {
    Elderly: "#E8F1F8",
    Children: "#E4F5EC",
    Youth: "#E0F7FA",
    PWD: "#EDE9FE",
    Mothers: "#FCE7F3",
  };
  return map[category] ?? Colors.primaryLight;
};
