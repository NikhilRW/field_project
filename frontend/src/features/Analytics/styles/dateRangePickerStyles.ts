import { Colors } from "@/shared/constants/color";
import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create({
  overlayWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 300,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  content: {
    gap: 20,
    marginBottom: 24,
  },
  dateSection: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.34)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
    gap: 10,
  },
  dateText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  applyText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});