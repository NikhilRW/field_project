import React from "react";
import { View, Text } from "react-native";
import { Colors } from "@/shared/constants/color";
import type { StatsCardProps } from "../types/props";
import { styles } from "../styles/statsCardStyles";

export const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  iconColor = Colors.primary,
}) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}18` }]}>
        <Icon size={20} color={iconColor} strokeWidth={2} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};
