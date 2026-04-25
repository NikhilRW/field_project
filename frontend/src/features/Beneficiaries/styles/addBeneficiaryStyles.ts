import { StyleSheet } from "react-native-unistyles";
import { Colors } from "@/shared/constants/color";

export const addBeneficiaryStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  photoUpload: {
    alignItems: "center",
    marginBottom: 28,
  },
  photoCircle: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    gap: 4,
  },
  photoText: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: "500" as const,
  },
  label: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  inputWrap: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    justifyContent: "center",
    marginBottom: 18,
  },
  textAreaWrap: {
    height: 90,
    paddingVertical: 12,
    justifyContent: "flex-start",
  },
  input: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textArea: {
    textAlignVertical: "top",
  },
  radioGroup: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 18,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  pickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 4,
  },
  pickerValue: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pickerDropdown: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  pickerOptionActive: {
    backgroundColor: Colors.primaryLight,
  },
  pickerOptionText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  pickerOptionTextActive: {
    color: Colors.primary,
    fontWeight: "600" as const,
  },
  saveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600" as const,
  },
});
