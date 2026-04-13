import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f8f7",
  },
  mainWrapper: {
    maxWidth: 1440,
    alignSelf: "center",
    width: "100%",
    paddingVertical: 24,
    zIndex: 1,
  },
  toolsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
    zIndex: 5000,
    elevation: 5,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  crumbText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  crumbActive: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },
  toolsActions: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
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
  filterBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },
  contentLayout: {
    flexDirection: "row",
    zIndex: 1,
  },
  gridContainer: {
    flex: 1,
  },

  // --- Product Card Style (Modified for Image Fix) ---
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    marginBottom: 16,
    // تم إلغاء الـ Padding هنا ليعمل الـ Pressable على كامل المساحة
    ...Platform.select({
      web: {
        transition: "transform 0.2s ease-in-out",
      },
    }),
  },
  imageContainer: {
    width: "100%",
    height: 220, // 👈 تحديد ارتفاع ثابت للصورة لحل مشكلة الحجم الضخم
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  productImage: {
    width: "80%",
    height: "80%",
  },
  stockBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#10b77f",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "900",
  },
  infoContainer: {
    padding: 16,
    flex: 1,
  },
  textStack: {
    marginBottom: 8,
  },
  brandName: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  enName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
    height: 40, // للحفاظ على سطرين دائمًا
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  mainPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: "900",
    color: "#10b77f",
  },
  currency: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#10b77f",
  },
  floatingAddBtn: {
    width: 36,
    height: 36,
    backgroundColor: "#10b77f",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingRemoveBtn: {
    backgroundColor: "#fee2e2",
  },

  // --- Pagination & Footer ---
  paginationSection: {
    marginTop: 32,
    alignItems: "center",
    paddingBottom: 20,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
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
  pageText: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },
});
