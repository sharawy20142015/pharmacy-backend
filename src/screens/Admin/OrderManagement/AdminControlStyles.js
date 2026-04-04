import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../theme/colors"; // تأكد من المسار حسب مشروعك

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.slate50,
  },

  // ==========================================
  // Header Styles
  // ==========================================
  header: {
    backgroundColor: COLORS.white,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
    ...Platform.select({
      web: { boxShadow: "0 2px 10px rgba(0,0,0,0.03)" },
      android: { elevation: 2 },
    }),
  },
  headerTitle: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 20,
    color: COLORS.slate900,
  },
  adminName: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 14,
    color: COLORS.slate600,
  },
  logoutBtnHeader: {
    padding: 8,
    backgroundColor: COLORS.red500 + "15",
    borderRadius: 8,
  },

  // ==========================================
  // Layout Styles
  // ==========================================
  mainLayout: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
    padding: 24,
  },
  tabContent: {
    flex: 1,
  },

  // ==========================================
  // Sidebar Styles
  // ==========================================
  sidebarLarge: {
    width: 260,
    backgroundColor: COLORS.white,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.slate200,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sidebarSmall: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
  },
  sidebarHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginBottom: 30,
    paddingHorizontal: 8,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 20,
    color: COLORS.white,
  },
  sidebarTitle: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 18,
    color: COLORS.slate900,
  },

  navItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    ...Platform.select({ web: { cursor: "pointer", transition: "all 0.2s" } }),
  },
  navItemActive: {
    backgroundColor: COLORS.primary + "15",
  },
  navItemSmall: {
    marginBottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  navText: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 15,
    color: COLORS.slate500,
  },
  navTextActive: {
    color: COLORS.primary,
  },

  logoutBtnSidebar: {
    marginTop: "auto",
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: COLORS.red500 + "10",
    borderRadius: 12,
  },
  logoutText: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 15,
    color: COLORS.red500,
  },

  // ==========================================
  // Placeholders (للفئات والمنتجات)
  // ==========================================
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 16,
    color: COLORS.slate500,
    marginTop: 16,
    marginBottom: 24,
  },
  addBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  addBtnText: {
    fontFamily: "Tajawal_700Bold",
    color: COLORS.white,
    fontSize: 15,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 16,
    color: COLORS.slate400,
    marginTop: 16,
  },
});
