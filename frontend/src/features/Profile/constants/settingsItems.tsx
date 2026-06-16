import React from "react";
import {
  Users,
  LogOut,
  UserPen,
} from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import type { ProfileSettingsItem } from "../types/settings";

export const buildProfileSettingsItems = (
  onLogout: () => void,
  isAdmin: boolean,
  onEditName?: () => void,
  onManageUsers?: () => void,
): ProfileSettingsItem[] => [
  ...(isAdmin
    ? [
        {
          icon: <Users size={16} color={Colors.secondary} strokeWidth={1.8} />,
          label: "Manage Users",
          sub: "Admins, users & donors",
          iconBg: Colors.secondaryLight,
          onPress: onManageUsers,
        },
      ]
    : []),
  {
    icon: (
      <UserPen size={16} color={Colors.primary} strokeWidth={1.8} />
    ),
    label: "Edit Name",
    sub: "Update your display name",
    iconBg: Colors.primaryLight,
    onPress: onEditName,
  },
  {
    icon: <LogOut size={16} color={Colors.error} strokeWidth={1.8} />,
    label: "Logout",
    isLogout: true,
    onPress: onLogout,
    iconBg: Colors.errorLight,
  },
];
