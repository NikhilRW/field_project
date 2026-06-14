import { StyleSheet, Platform } from "react-native";
import { Colors } from "@/shared/constants/color";

export const tabLayoutStyles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.8)",
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: 0,
    ...(Platform.OS === "web" ? { height: 68 } : {}),
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600" as const,
    letterSpacing: 0.2,
    marginTop: 2,
  },
  tabItem: {
    paddingTop: 2,
  },
  iconWrap: {
    width: 40,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryLight,
  },
});
