import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f8f7" },
  mainWrapper: {
    maxWidth: 1440,
    alignSelf: "center",
    width: "100%",
    paddingVertical: 24,
    // مهم جداً للسماح للعناصر العائمة بالظهور
    zIndex: 1,
  },
  toolsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
    // 🟢 تعديل جوهري: نضمن إن الصف العلوي له أولوية في الطبقات
    zIndex: 5000,
    elevation: 5,
  },
  breadcrumb: { flexDirection: "row", alignItems: "center", gap: 8 },
  crumbText: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  crumbActive: { fontSize: 14, fontWeight: "bold", color: "#0f172a" },

  // 🟢 تعديل الـ Actions عشان السيرش بار اللي جواه يظهر فوق الكل
  toolsActions: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
    justifyContent: "flex-end",
    zIndex: 6000,
  },

  mobileFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterBtnText: { fontSize: 14, fontWeight: "bold", color: "#0f172a" },

  contentLayout: {
    flexDirection: "row",
    // نخليه تحت الـ toolsRow في الترتيب
    zIndex: 1,
  },
  gridContainer: { flex: 1 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    // إضافة Padding بسيط عشان لو القائمة فتحت متغطيش أول صف بالكامل
    paddingTop: Platform.OS === "web" ? 0 : 5,
  },

  productCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2, // قللنا الـ elevation هنا عشان مينافسش السيرش بار
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    position: "relative",
  },
  productImage: { width: "100%", height: "100%" },
  stockBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#10b77f",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockBadgeText: { color: "#fff", fontSize: 10, fontWeight: "900" },
  infoContainer: { padding: 16 },
  textStack: { marginBottom: 12 },
  brandName: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  enName: { fontSize: 14, fontWeight: "800", color: "#0f172a", height: 40 },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  finalPrice: { fontSize: 20, fontWeight: "900", color: "#10b77f" },
  currency: { fontSize: 10, fontWeight: "bold", color: "#10b77f" },
  floatingAddBtn: {
    width: 36,
    height: 36,
    backgroundColor: "#10b77f",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingRemoveBtn: { backgroundColor: "#fee2e2" },

  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 40,
    paddingHorizontal: 16,
  },
  pageButton: {
    minWidth: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  activePageButton: {
    backgroundColor: "#10b77f",
    borderColor: "#10b77f",
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#64748b",
  },
  activePageButtonText: {
    color: "#fff",
  },
  paginationSection: {
    marginTop: 16,
    alignItems: "center",
    paddingBottom: 40,
  },
  pageText: { fontSize: 13, color: "#94a3b8", fontWeight: "600" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },
});
