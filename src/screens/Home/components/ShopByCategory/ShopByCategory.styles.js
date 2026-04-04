import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const styles = StyleSheet.create({
  section: {
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  loaderContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  indicator: {
    width: 6,
    height: 28,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.slate900,
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontWeight: "bold",
    fontSize: 14,
    color: COLORS.primary,
  },

  // --- شبكة الكروت (Grid) ---
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // ده اللي بيخلي الكروت تنزل تحت بعضها
    gap: 16,
  },

  // --- الكارت ---
  card: {
    aspectRatio: 1, // يحافظ على شكل المربع
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: COLORS.white,
    ...Platform.select({
      web: { cursor: "pointer", transition: "transform 0.3s ease" },
    }),
  },
  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    justifyContent: "flex-end",
    padding: 12,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: COLORS.white,
    textAlign: "left",
    lineHeight: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // --- كارت جميع الأقسام ---
  viewAllCard: {
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary + "40",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary + "05",
  },
  viewAllCardText: {
    fontWeight: "bold",
    fontSize: 14,
    color: COLORS.slate700,
    marginTop: 8,
  },
});
