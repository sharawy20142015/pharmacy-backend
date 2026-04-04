import { StyleSheet, Platform } from "react-native";

const colors = {
  primary: "#11b67f",
  bgLight: "#f8fafc", // لون أهدى وأنظف للخلفية
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
    fontWeight: "800", // خلينا العنوان أتقل شوية
    color: colors.slate900,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerActions: { flexDirection: "row-reverse", gap: 8 },

  // Layout
  scrollContent: { paddingBottom: 100 },
  mainWrapper: {
    maxWidth: 1280,
    alignSelf: "center",
    width: "100%",
    padding: 16,
    paddingTop: 24,
  },
  gridContainer: { flexDirection: "column", gap: 32 },
  desktopGrid: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 48,
  }, // مسافة أكبر في الديسكتوب
  galleryCol: { width: "100%" },
  detailsCol: { width: "100%" },

  // --- Image Gallery Premium Styles ---
  imageBox: {
    backgroundColor: colors.white,
    aspectRatio: 1,
    borderRadius: 32, // تدويرة أكبر وأشيك
    // شيلنا الـ border وخلينا مكانه ظل خفيف جداً لنظافة التصميم
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  img3DWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mainImg: {
    width: "60%",
    height: "60%",
    zIndex: 10,
  },
  // 👇 السر هنا: الصورة هتاخد 90% من المساحة في وضع الموبايل عشان تبان ضخمة وتخطف العين
  mainImgMobile: {
    width: "90%",
    height: "90%",
  },
  productFloorShadow: {
    position: "absolute",
    bottom: "10%",
    width: 150,
    height: 12,
    backgroundColor: "#000",
    borderRadius: 100,
    opacity: 0.12,
    transform: [{ scaleX: 1 }],
    zIndex: 1,
  },
  productFloorShadowMobile: {
    width: 200, // ظل أكبر في الموبايل عشان يتناسب مع الصورة الأكبر
    bottom: "5%",
  },
  zoomBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10, // كبرنا الزرار شوية
    borderRadius: 14,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 20,
  },

  // Thumbnails
  thumbScroll: { paddingBottom: 8, marginTop: 24, gap: 16 },
  thumbItem: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
    padding: 4,
    marginLeft: 16,
  },
  thumbItemActive: { borderColor: colors.primary, borderWidth: 2 },
  thumbImg: { width: "100%", height: "100%", borderRadius: 12 },

  // Trust Markers
  trustMarkers: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.slate200,
  },
  trustItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    width: "100%",
    minWidth: 200,
    flex: 1,
  },
  trustIconBg: {
    backgroundColor: "rgba(17, 182, 127, 0.1)",
    padding: 10,
    borderRadius: 50,
  },
  trustText: {
    fontSize: 14,
    fontWeight: "700", // قلناه لـ Bold
    color: colors.slate800,
    textAlign: "right",
  },

  // Details Card
  detailsCard: {
    backgroundColor: "transparent", // شيلنا الخلفية البيضا والبوردر عشان تبان مدمجة وأشيك
    padding: 8,
  },
  brandName: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 14,
    textAlign: "right",
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: 26, // كبرنا اسم المنتج
    fontWeight: "900",
    color: colors.slate900,
    marginTop: 8,
    lineHeight: 36,
    textAlign: "right",
  },
  sku: {
    color: colors.slate500,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "right",
  },

  priceRow: {
    flexDirection: "row-reverse",
    alignItems: "baseline",
    gap: 16,
    marginTop: 24,
  },
  finalPrice: { fontSize: 38, fontWeight: "900", color: colors.primary }, // السعر بقى أضخم وأوضح
  oldPrice: {
    fontSize: 20,
    color: colors.slate400,
    textDecorationLine: "line-through",
    fontWeight: "600",
  },

  // Prescription Box
  prescAlert: {
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.3)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 24,
  },
  prescTextCol: { flex: 1 },
  prescTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.slate800,
    textAlign: "right",
  },
  prescSub: {
    fontSize: 12,
    color: colors.slate600,
    marginTop: 4,
    textAlign: "right",
  },
  prescBtn: {
    backgroundColor: colors.prescBlue,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  prescBtnText: { color: colors.white, fontSize: 14, fontWeight: "700" },

  // --- Actions & Buttons ---
  purchaseControls: { flexDirection: "row-reverse", gap: 16, marginTop: 32 },

  addCartBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOpacity: 0.25, // زودنا الشادو شوية للزراير الأساسية
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  addCartText: { color: colors.white, fontSize: 16, fontWeight: "900" }, // Bold Text

  removeFromCartBtn: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
    borderWidth: 1,
    shadowColor: "#ef4444",
  },
  mobileAddToCartBtn: {
    backgroundColor: colors.slate50,
    borderColor: colors.primary,
  },
  mobileRemoveFromCartBtn: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
  },

  qtyBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.slate50,
    borderRadius: 12,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "900",
    width: 48,
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
    padding: 20,
    backgroundColor: colors.white,
  },
  accordionTitle: { fontSize: 16, fontWeight: "800", color: colors.slate800 },
  accordionBody: { paddingHorizontal: 20, paddingBottom: 20 },
  accordionContent: {
    fontSize: 15, // كبرنا الخط عشان يتقري أسهل
    color: colors.slate600,
    lineHeight: 26,
    textAlign: "right",
  },

  // Alternatives Section
  alternativesSection: { marginTop: 64, paddingBottom: 24 },
  altHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  altTitleRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  altTitle: { fontSize: 22, fontWeight: "900", color: colors.slate900 },
  altLink: { color: colors.primary, fontSize: 15, fontWeight: "800" },
  altScroll: { paddingRight: 16, gap: 16 },

  altCard: {
    width: 280,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    marginLeft: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  altImgBox: {
    backgroundColor: colors.slate50,
    borderRadius: 16,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  altImg: { width: "80%", height: "80%" }, // خلينا صور البدائل أكبر شوية
  altName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.slate800,
    textAlign: "right",
    marginBottom: 4,
  },
  altSub: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.slate500,
    textAlign: "right",
    marginBottom: 16,
  },
  altFooter: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  altPrice: { fontSize: 18, fontWeight: "900", color: colors.primary },
  altCartBtn: {
    backgroundColor: "rgba(17, 182, 127, 0.1)",
    padding: 12,
    borderRadius: 14,
  },

  // Mobile Footer
  mobileFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.slate200,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    flexDirection: "row-reverse",
    gap: 16,
    zIndex: 100,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
});
