import { StyleSheet } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const styles = StyleSheet.create({
  section: {
    marginBottom: 56,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.slate900,
  },
  seeAll: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  // مسحنا كل ستايلات الـ card والـ image والـ text من هنا، لأنها بقت مسؤولية الـ ProductCard
});
