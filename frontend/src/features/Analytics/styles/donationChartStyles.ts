import { Colors } from "@/shared/constants/color";
import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.38)",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.82)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  graphArea: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  yAxis: {
    width: 36,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 4,
    marginRight: 6,
  },
  yLabel: {
    color: Colors.textTertiary,
    fontSize: 9,
    textAlign: "right",
  },
  graphWrapper: {
    flex: 1,
  },
  graph: {
    height: 180,
    width: "100%",
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 4,
  },
  xLabel: {
    color: Colors.textTertiary,
    fontSize: 9,
  },
  emptyContainer: {
    backgroundColor: "rgba(255,255,255,0.38)",
    borderRadius: 14,
    padding: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.82)",
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
