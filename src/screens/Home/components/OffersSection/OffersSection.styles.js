import { StyleSheet } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const styles = StyleSheet.create({
  section: {
    marginBottom: 40,
  },
  scrollContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  cardPrimary: {
    backgroundColor: "rgba(16, 183, 127, 0.05)",
    borderColor: "rgba(16, 183, 127, 0.2)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  cardSecondary: {
    backgroundColor: "rgba(56, 189, 248, 0.05)",
    borderColor: "rgba(56, 189, 248, 0.2)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  contentWrap: {
    flex: 1,
    paddingRight: 10,
  },
  badgePrimary: {
    backgroundColor: COLORS.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeSecondary: {
    backgroundColor: COLORS.secondary,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: "bold" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.slate900,
    marginBottom: 4,
  },
  desc: { color: COLORS.slate500, fontSize: 14, marginBottom: 16 },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnSecondary: {
    backgroundColor: COLORS.secondary,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: { color: COLORS.white, fontWeight: "bold", fontSize: 14 },
  iconWrap: { opacity: 0.3 },
});
