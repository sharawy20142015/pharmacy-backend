import { StyleSheet } from "react-native";

const PRIMARY = "#10b77f";
const TEXT_DARK = "#0f172a";
const TEXT_MUTED = "#64748b";
const BORDER_COLOR = "#f1f5f9";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9fafb" },
  mainWrapper: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  layoutContainer: { flexDirection: "row", gap: 32 },
  layoutContainerMobile: { flexDirection: "column" },

  itemsSection: { flex: 1, width: "100%" },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    paddingBottom: 16,
    marginBottom: 24,
  },
  pageTitle: { fontSize: 26, fontWeight: "800", color: TEXT_DARK },
  pageSubtitle: { fontSize: 14, color: TEXT_MUTED, marginTop: 4 },
  itemsCount: { fontSize: 16, fontWeight: "700", color: PRIMARY },

  itemsList: { gap: 16 },
  cartItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    gap: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cartItemRow: { flexDirection: "row", alignItems: "center" },
  cartItemCol: { flexDirection: "column" },

  itemImgBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  itemImgBoxDesktop: { width: 110, height: 110 },
  itemImgBoxMobile: { width: "100%", height: 200 },
  itemImg: { width: "100%", height: "100%" },

  itemDetails: { flex: 1, width: "100%" },
  itemHeader: { gap: 4 },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemHeaderCol: { flexDirection: "column" },

  itemTitle: { fontSize: 16, fontWeight: "700", color: TEXT_DARK },
  itemDesc: { fontSize: 13, color: TEXT_MUTED, marginTop: 2 },
  itemPrice: { fontSize: 17, fontWeight: "800", color: TEXT_DARK },

  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 2,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    width: 30,
    textAlign: "center",
    fontWeight: "700",
    color: TEXT_DARK,
  },

  removeBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  removeText: { fontSize: 13, fontWeight: "600", color: "#ef4444" },

  summarySection: { width: "100%" },
  summarySectionDesktop: { width: 380 },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 20,
  },

  promoInputRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  promoInput: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  promoBtn: {
    backgroundColor: "#38bdf8",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  promoBtnText: { color: "#fff", fontWeight: "700" },

  breakdownSection: {
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
    paddingBottom: 20,
    marginBottom: 20,
    gap: 12,
  },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between" },
  breakdownLabel: { color: TEXT_MUTED },
  breakdownVal: { fontWeight: "600", color: TEXT_DARK },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  totalLabel: { fontSize: 18, fontWeight: "700", color: TEXT_DARK },
  totalVal: { fontSize: 24, fontWeight: "900", color: PRIMARY },

  checkoutBtn: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 10,
  },
  checkoutBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  trustBadges: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    opacity: 0.6,
  },
  trustBadgeItem: { alignItems: "center", gap: 4 },
  trustBadgeText: { fontSize: 10, fontWeight: "700", color: TEXT_MUTED },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIconBox: {
    backgroundColor: "#f1f5f9",
    padding: 30,
    borderRadius: 100,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 24,
  },
  startShoppingBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  startShoppingText: { color: "#fff", fontWeight: "700" },
});
