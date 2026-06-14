import { StyleSheet } from "react-native-unistyles";
import { Colors } from "@/shared/constants/color";

export const addActivityStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  inputWrap: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 14,
  },
  input: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textAreaWrap: {
    minHeight: 120,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  pickerBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  pickerValue: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  pickerDropdown: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: "hidden",
    marginBottom: 14,
  },
  pickerOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pickerOptionActive: {
    backgroundColor: Colors.primaryLight,
  },
  pickerOptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  pickerOptionTextActive: {
    color: Colors.primary,
    fontWeight: "600" as const,
  },
  saveContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700" as const,
  },
});
