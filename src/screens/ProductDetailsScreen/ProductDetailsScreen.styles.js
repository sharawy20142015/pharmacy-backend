import { StyleSheet, Platform } from "react-native";

const colors = {
  primary: "#11b67f",
  bgLight: "#f8fafc",
  bgDark: "#11211c",
  prescBlue: "#38BDF8",
  slate50: "#f8fafc",
  slate200: "#e2e8f0",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate800: "#1e293b",
  slate900: "#0f172a",
  white: "#ffffff",
  dangerBg: "#fee2e2",
  dangerBorder: "#fca5a5",
};

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgLight },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: colors.slate200,
    zIndex: 50,
  },
  headerContainer: {
    height: 64,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    maxWidth: 1280,
    alignSelf: "center",
    width: "100%",
  },
  iconBtn: { padding: 8, borderRadius: 50 },
  rtlIcon: { transform: [{ scaleX: -1 }] },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.slate900,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerActions: { flexDirection: "row-reverse", gap: 8 },

  // Layout
  scrollContent: { paddingBottom: 60 },
  mainWrapper: {
    maxWidth: 1280,
    alignSelf: "center",
    width: "100%",
    padding: 16,
    paddingTop: 24,
  },
  gridContainer: { flexDirection: "column", gap: 24 },
  desktopGrid: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 48,
  },
  galleryCol: { width: "100%" },
  detailsCol: { width: "100%" },

  // --- Image Gallery Styles ---
  imageBox: {
    backgroundColor: colors.white,
    aspectRatio: 1,
    borderRadius: 32,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    padding: 16,
    position: "relative",
  },
  imageBoxMobile: {
    padding: 8,
    paddingBottom: 16, // عشان نسيب مكان للنقط
    borderRadius: 24,
  },
  img3DWrapper: {
    width: "100%",
    height: "90%", // قللنا الارتفاع شوية عشان النقط اللي تحتها تبان
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mainImg: {
    width: "100%",
    height: "100%",
    zIndex: 10,
  },
  mainImgMobile: {
    width: "90%",
    height: "90%",
  },
  productFloorShadow: {
    position: "absolute",
    bottom: "2%",
    width: 150,
    height: 12,
    backgroundColor: "#000",
    borderRadius: 100,
    opacity: 0.12,
    transform: [{ scaleX: 1 }],
    zIndex: 1,
  },
  productFloorShadowMobile: {
    width: "60%",
    bottom: "0%",
    height: 8,
  },

  // 👈 ستايل الأسهم الجانبية
  arrowBtn: {
    position: "absolute",
    top: "45%", // توسيط عمودي
    width: 44,
    height: 44,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: 20,
  },
  arrowLeft: { left: 10 },
  arrowRight: { right: 10 },

  // 👈 ستايل نقاط الترقيم
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#007AFF", // أزرق زي اللي في الصورة
    width: 10, // النقطة النشطة بتبقى أكبر سيكا
    height: 10,
  },
  dotInactive: {
    backgroundColor: "#D1D1D6", // رمادي فاتح
  },

  // Thumbnails
  thumbScroll: { paddingBottom: 8, marginTop: 16, gap: 12 },
  thumbItem: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
    padding: 4,
    marginLeft: 12,
  },
  thumbItemMobile: {
    width: 65,
    height: 65,
    borderRadius: 12,
  },
  // 👈 ستايل الإطار الأخضر زي اللي في الصورة بالظبط
  thumbItemActive: {
    borderColor: colors.primary, // اللون الأخضر بتاعك (#11b67f)
    borderWidth: 2,
  },
  thumbImg: { width: "100%", height: "100%", borderRadius: 10 },

  // Trust Markers
  trustMarkers: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.slate200,
    justifyContent: "center",
  },
  trustItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    minWidth: "45%",
    flex: 1,
  },
  trustIconBg: {
    backgroundColor: "rgba(17, 182, 127, 0.1)",
    padding: 8,
    borderRadius: 50,
  },
  trustText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.slate800,
    textAlign: "right",
    flexShrink: 1,
  },

  // Details Card
  detailsCard: {
    backgroundColor: "transparent",
    padding: 4,
  },
  brandName: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 14,
    textAlign: "right",
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.slate900,
    marginTop: 8,
    lineHeight: 36,
    textAlign: "right",
  },
  productTitleMobile: {
    fontSize: 22,
    lineHeight: 30,
  },
  sku: {
    color: colors.slate500,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "right",
  },

  priceRow: {
    flexDirection: "row-reverse",
    alignItems: "baseline",
    gap: 12,
    marginTop: 20,
  },
  finalPrice: { fontSize: 36, fontWeight: "900", color: colors.primary },
  finalPriceMobile: { fontSize: 28 },
  oldPrice: {
    fontSize: 18,
    color: colors.slate400,
    textDecorationLine: "line-through",
    fontWeight: "600",
  },
  oldPriceMobile: { fontSize: 16 },

  // Actions & Buttons (Desktop & Shared)
  purchaseControls: { flexDirection: "row-reverse", gap: 16, marginTop: 32 },

  addCartBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addCartText: { color: colors.white, fontSize: 14, fontWeight: "900" },

  removeFromCartBtn: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
    borderWidth: 1,
    shadowColor: "#ef4444",
  },

  // --- Mobile Footer Specific Styles ---
  mobileFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.slate200,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 100,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -5 },
  },
  mobileButtonsContainer: {
    flex: 1,
    flexDirection: "row-reverse",
    gap: 8,
    marginLeft: 12,
  },
  mobileBuyNowBtn: {
    flex: 2,
    height: 46,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
  },
  mobileCartIconBtn: {
    flex: 1,
    height: 46,
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 1,
  },
  mobileAddToCartBtn: {
    backgroundColor: colors.slate50,
    borderColor: colors.primary,
  },
  mobileRemoveFromCartBtn: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
  },
  mobileQtyContainer: {
    width: 105,
  },

  // --- Quantity Selector ---
  qtyBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 14,
    padding: 2,
    height: 46,
  },
  qtyBtn: {
    width: 36,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.slate50,
    borderRadius: 10,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
    color: colors.slate900,
  },

  // Accordions
  accordionsWrapper: { marginTop: 24, gap: 12 },
  accordionContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  accordionHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.white,
  },
  accordionTitle: { fontSize: 15, fontWeight: "800", color: colors.slate800 },
  accordionBody: { paddingHorizontal: 16, paddingBottom: 16 },
  accordionContent: {
    fontSize: 14,
    color: colors.slate600,
    lineHeight: 24,
    textAlign: "right",
  },

  // Alternatives Section
  alternativesSection: { marginTop: 40, paddingBottom: 24 },
  altHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  altTitleRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  altTitle: { fontSize: 20, fontWeight: "900", color: colors.slate900 },
  altLink: { color: colors.primary, fontSize: 14, fontWeight: "800" },
  altScroll: { paddingRight: 8, gap: 12 },

  altCard: {
    width: 240,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 12,
    marginLeft: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  altImgBox: {
    backgroundColor: colors.slate50,
    borderRadius: 16,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    padding: 8,
  },
  altImg: {
    width: "100%",
    height: "100%",
  },
  altName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.slate800,
    textAlign: "right",
    marginBottom: 4,
  },
  altSub: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.slate500,
    textAlign: "right",
    marginBottom: 12,
  },
  altFooter: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  altPrice: { fontSize: 16, fontWeight: "900", color: colors.primary },
  altCartBtn: {
    backgroundColor: "rgba(17, 182, 127, 0.1)",
    padding: 10,
    borderRadius: 12,
  },
});
