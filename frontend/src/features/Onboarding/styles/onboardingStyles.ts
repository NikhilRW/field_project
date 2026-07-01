import { StyleSheet } from "react-native-unistyles";
import { Colors } from "@/shared/constants/color";
import { isWeb } from "@/shared/constants/platform";

export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingTop: isWeb ? 12 : 0,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 24,
  },
  image: {
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
    backgroundColor: Colors.surface,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    borderRadius: 3,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  nextBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700" as const,
  },
});