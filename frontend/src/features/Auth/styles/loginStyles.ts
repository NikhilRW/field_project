import { StyleSheet } from "react-native-unistyles";
import { Colors } from "@/shared/constants/color";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  topSection: {
    backgroundColor: "#0A4F7A",
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: -20,
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  brandName: {
    fontSize: 21,
    fontWeight: "700" as const,
    color: "#fff",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  brandOrg: {
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "500" as const,
    marginBottom: 6,
  },
  brandSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
  },
  formCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 22,
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },
  roleSelector: {
    flexDirection: "row",
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  roleTabActive: {
    backgroundColor: Colors.primary,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
  },
  roleTabTextActive: {
    color: "#fff",
    fontWeight: "600" as const,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 22,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "500" as const,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600" as const,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 24,
  },
});
