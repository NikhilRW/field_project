import { Colors } from "@/shared/constants/color";
import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 24,
    paddingBottom: 100,
  },
  header: {
    gap: 4,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  filterSection: {
    gap: 8,
  },
  timeFilters: {
    gap: 8,
  },
  timeFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    borderRadius: 999,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.34)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
    gap: 6,
  },
  timeFilterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeFilterText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
  timeFilterTextActive: {
    color: "#ffffff",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  chartSection: {
    gap: 12,
    marginTop: 8,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  graphMetricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  graphMetricLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    width: 48,
  },
  graphPickerButton: {
    flex: 1,
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
  graphPickerText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerModal: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    minWidth: 200,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  pickerOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.primaryLight,
  },
  pickerOptionText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: "500",
  },
  pickerOptionTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
