import React from "react";
import { Pencil, Users, Bell, LogOut } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import type { ProfileSettingsItem } from "../types/settings";

export const buildProfileSettingsItems = (
  onLogout: () => void,
  isAdmin: boolean,
): ProfileSettingsItem[] => [
  ...(isAdmin
    ? [
        {
          icon: <Pencil size={16} color={Colors.primary} strokeWidth={1.8} />,
          label: "Edit Profile",
          sub: "Update NGO information",
          iconBg: Colors.primaryLight,
        },
        {
          icon: <Users size={16} color={Colors.secondary} strokeWidth={1.8} />,
          label: "Manage Users",
          sub: "Admins, users & donors",
          iconBg: Colors.secondaryLight,
        },
      ]
    : []),
  {
    icon: <Bell size={16} color={Colors.accent} strokeWidth={1.8} />,
    label: "Notifications",
    sub: isAdmin ? "Alerts and reminders" : "Activity and app alerts",
    iconBg: Colors.accentLight,
  },
  {
    icon: <LogOut size={16} color={Colors.error} strokeWidth={1.8} />,
    label: "Logout",
    isLogout: true,
    onPress: onLogout,
    iconBg: Colors.errorLight,
  },
];
