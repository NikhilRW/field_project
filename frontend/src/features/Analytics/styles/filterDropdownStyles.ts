import { Colors } from "@/shared/constants/color";
import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.34)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
    gap: 8,
  },
  buttonText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    minWidth: 160,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionSelected: {
    backgroundColor: Colors.primaryLight,
  },
  optionText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
