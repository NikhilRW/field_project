import { Colors } from "@/shared/constants/color";

const roleColorMap: Record<string, string> = {
  Medical: "#0D5C91",
  Logistics: "#1D9E54",
  Technical: "#E8880C",
  "Social Work": "#7C3AED",
  Education: "#0891B2",
};

const roleBgMap: Record<string, string> = {
  Medical: Colors.primaryLight,
  Logistics: Colors.secondaryLight,
  Technical: Colors.accentLight,
  "Social Work": "#EDE9FE",
  Education: "#E0F7FA",
};

export const getVolunteerRoleColor = (role: string) =>
  roleColorMap[role] ?? Colors.primary;

export const getVolunteerRoleBg = (role: string) =>
  roleBgMap[role] ?? Colors.primaryLight;
