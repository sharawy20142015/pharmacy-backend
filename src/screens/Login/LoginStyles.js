import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const COLORS = {
  primary: "#10b748",
  bgLight: "#f6f8f6",
  white: "#ffffff",
  slate900: "#0f172a",
  slate700: "#334155",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  slate50: "#f8fafc",
  skyAccent: "#38BDF8",
};

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // ضبط المسافة الرأسية للويب والموبايل
    paddingVertical: Platform.OS === "web" ? 40 : 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24, // زوايا أنعم لشكل عصري
    borderWidth: 1,
    borderColor: COLORS.slate200,
    width: "100%",
    maxWidth: 420, // عرض مثالي للـ Login
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  logoSection: {
    paddingTop: 48,
    paddingBottom: 24,
    alignItems: "center",
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(16, 183, 72, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 183, 72, 0.1)",
  },
  appName: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.slate900,
    letterSpacing: -0.5,
  },
  welcomeSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: width < 380 ? 24 : 28,
    fontWeight: "800",
    color: COLORS.slate900,
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: COLORS.slate500,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
  },
  formSection: {
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  // --- زرار جوجل المطور ---
  loginBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.slate200,
    // ظل خفيف للزرار
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.slate700,
  },
  // --- البانر السفلي ---
  banner: {
    marginHorizontal: 32,
    marginBottom: 32,
    padding: 16,
    backgroundColor: "rgba(16, 183, 72, 0.04)",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 183, 72, 0.08)",
  },
  bannerIconBox: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerContent: { flex: 1 },
  bannerTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
    textTransform: "uppercase",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.slate600,
    lineHeight: 18,
  },
  cardFooter: {
    backgroundColor: COLORS.slate50,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
  },
  footerText: {
    color: COLORS.slate500,
    fontWeight: "600",
    fontSize: 14,
  },
  signUpLink: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 14,
    marginLeft: 6,
  },
  copyrightText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.slate400,
    marginTop: 24,
    lineHeight: 18,
    paddingHorizontal: 40,
  },
});
