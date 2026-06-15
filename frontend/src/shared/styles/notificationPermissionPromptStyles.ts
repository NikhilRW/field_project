import { StyleSheet } from "react-native-unistyles";
import { Colors } from "../constants/color";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  enableBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  enableBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  skipBtnText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: "600",
  },
});
