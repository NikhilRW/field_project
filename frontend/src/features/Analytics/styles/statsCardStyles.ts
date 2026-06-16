import { Colors } from "@/shared/constants/color";
import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.38)",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.82)",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  value: {
    fontSize: 24,
    color: Colors.textPrimary,
    fontWeight: "700",
  },
});
