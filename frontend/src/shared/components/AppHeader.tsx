import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";
import BrandLogo from "@/shared/components/BrandLogo";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import { appHeaderStyles } from "@/shared/styles/appHeaderStyles";
import type { AppHeaderProps } from "@/shared/types/appHeader";

const getInitials = (name?: string | null) =>
  name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

export default function AppHeader({
  orgName = "Helping Hands",
  showNotification = true,
}: AppHeaderProps) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const title = isAdmin ? orgName : user?.name ?? "User";
  const subtitle = isAdmin ? "Samajik Seva Sanstha" : "User Portal";
  const initials = getInitials(user?.name);
  const avatarLabel = isAdmin ? "A" : initials;

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={[styles.logoMark, isAdmin && styles.logoMarkBrand]}>
          {isAdmin ? <BrandLogo size={40} /> : <Text style={styles.logoText}>{initials}</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.orgName} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.orgSub}>{subtitle}</Text>
        </View>
      </View>
      {showNotification && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} testID="notification-btn">
            <Bell size={19} color={Colors.textPrimary} strokeWidth={1.8} />
            <View style={styles.badge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLabel}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = appHeaderStyles;
