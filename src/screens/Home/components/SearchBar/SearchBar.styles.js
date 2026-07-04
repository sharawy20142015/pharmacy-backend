import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const styles = StyleSheet.create({
  mainWrapper: {
    width: "100%",
    position: "relative", // 👈 مهم جداً يفضل relative عشان القائمة تنزل تحته
    marginTop: 5,
    marginBottom: 10,
    zIndex: 999999, // 👈 أرقام ضخمة لضمان التفوق في الطبقات
    elevation: 9999,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    paddingHorizontal: 16,
    zIndex: 999999,
    elevation: 9999,
    ...Platform.select({
      ios: {
        shadowColor: "#94a3b8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
    }),
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.slate900,
    ...Platform.select({
      web: { outlineStyle: "none" },
    }),
  },
  clearBtn: {
    backgroundColor: "#f1f5f9",
    padding: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  suggestionsBox: {
    position: "absolute",
    top: 60, // 👈 ينزل تحت السيرش بثبات
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    zIndex: 9999999, // 👈 أعلى طبقة ممكنة للقائمة
    elevation: 9999,
    maxHeight: 260,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#64748b",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 15,
      },
      android: {
        elevation: 20,
      },
      web: {
        boxShadow: "0px 10px 30px rgba(0,0,0,0.15)", // ظل يبرزها على الويب
      },
    }),
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 12,
    backgroundColor: "#ffffff", // 👈 حطينا لون خلفية صريح عشان لو وراها صور متظهرش من خلالها
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(16, 183, 127, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.slate700,
    fontWeight: "500",
    textAlign: "left",
    lineHeight: 22,
    flexWrap: "wrap",
  },
});
