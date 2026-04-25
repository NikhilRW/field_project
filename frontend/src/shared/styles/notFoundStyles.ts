import { StyleSheet } from "react-native-unistyles";
import { Colors } from "@/shared/constants/color";

export const notFoundStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  link: {
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
});
