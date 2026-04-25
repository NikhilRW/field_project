import type { ReactNode } from "react";

export interface ProfileSettingsItem {
  icon: ReactNode;
  label: string;
  sub?: string;
  isLogout?: boolean;
  onPress?: () => void;
  iconBg: string;
}
