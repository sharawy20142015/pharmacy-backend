import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const styles = StyleSheet.create({
  section: {
    marginBottom: 56,
    paddingHorizontal: Platform.OS === "web" ? 0 : 16,
  },
  loaderContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicator: {
    width: 6,
    height: 32,
    backgroundColor: COLORS.primary || "#38bdf8",
    borderRadius: 6,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "900", // أثقل وزن للخط (Black)
    color: "#0f172a",
    letterSpacing: -0.5,
    textTransform: "capitalize",
  },
  seeAll: {
    color: COLORS.primary || "#10b77f",
    fontWeight: "800",
    fontSize: 15,
    marginBottom: 4,
  },
  scrollContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
});
