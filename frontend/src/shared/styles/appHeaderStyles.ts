import { StyleSheet } from "react-native-unistyles";
import { Colors } from "@/shared/constants/color";

export const appHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMarkBrand: {
    backgroundColor: "transparent",
  },
  logoText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  orgName: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  orgSub: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: -1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    position: "relative",
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600" as const,
  },
});
