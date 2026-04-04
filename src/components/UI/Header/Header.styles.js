import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0", // مطابق لـ border-slate-200
    zIndex: 50,
    elevation: 4, // للاندرويد
    shadowColor: "#000", // للويب و iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerContainer: {
    maxWidth: 1440,
    width: "100%",
    height: 80,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },

  // الجزء الشمال (اللوجو واللينكات)
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginRight: 48, // مسافة gap-12 في Tailwind
  },
  logoIconBox: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "900", // font-extrabold
    color: "#0f172a", // slate-900
    letterSpacing: -0.5,
  },
  logoTextHighlight: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  // النفيجيشن (ديسكتوب)
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32, // gap-8
  },
  navItem: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  navItemActive: {
    color: COLORS.primary,
  },

  // الجزء اليمين (البحث والأيقونات)
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  searchContainer: {
    position: "relative",
    marginRight: 16,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: 10,
    zIndex: 10,
  },
  searchInput: {
    width: 256, // w-64
    height: 40,
    backgroundColor: "#f1f5f9", // slate-100
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 14,
    color: "#0f172a",
  },

  // الأيقونات الدائرية
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "bold",
  },
});
