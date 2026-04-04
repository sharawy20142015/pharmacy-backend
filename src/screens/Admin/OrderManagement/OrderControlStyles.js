import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  webWrapper: {
    flex: 1,
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
    backgroundColor: COLORS.backgroundLight,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 20,
    paddingTop: Platform.OS === "android" ? 50 : 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    zIndex: 10,
  },
  headerTitle: { color: COLORS.white, fontSize: 22, fontWeight: "bold" },
  adminName: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 12,
  },
  content: { flex: 1 },
  listPadding: { paddingHorizontal: 15, paddingBottom: 40, paddingTop: 10 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    color: COLORS.slate500,
    fontSize: 16,
    fontWeight: "600",
  },
});
