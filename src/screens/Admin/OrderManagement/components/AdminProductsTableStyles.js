import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../../../theme/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // خلينا الكونتينر شفاف وبدون شادو عشان يندمج مع خلفية الصفحة نفسها
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableWrapper: {
    minWidth: 950,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden", // عشان الحواف تفضل ناعمة
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  // هيدر أروق ومندمج أكتر
  tableHeader: {
    flexDirection: "row-reverse",
    backgroundColor: COLORS.slate50, // لون فاتح جداً أروق من الأول
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
  },
  headerText: {
    fontWeight: "bold",
    color: COLORS.slate500,
    textAlign: "right",
    paddingHorizontal: 6,
    fontSize: 13,
  },
  tableRow: {
    flexDirection: "row-reverse",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate100,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  // لما تعمل Hover أو تمسك الصف (لو حابب)
  rowEven: {
    backgroundColor: "#f8fafc", // لون خفيف جداً للصفوف الزوجية عشان يريح العين
  },
  cellText: {
    color: COLORS.slate700,
    textAlign: "right",
    paddingHorizontal: 6,
    fontSize: 14,
  },
  productName: {
    color: COLORS.slate900,
    fontWeight: "600",
  },
  cellImageContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 6,
  },
  productImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
    backgroundColor: COLORS.slate100,
  },
  actionsContainer: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    gap: 12,
    paddingHorizontal: 6,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#e0f2fe",
  },
  deleteBtn: {
    backgroundColor: "#fee2e2",
  },

  // ==========================================
  // 🌟 ستايلات الـ Pop-up (Modal) بتاع التعديل
  // ==========================================
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // خلفية شفافة غامقة
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width > 600 ? 500 : "90%", // لو شاشة كبيرة ياخد 500 بيكسل، لو موبايل ياخد 90%
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.slate800,
    marginBottom: 20,
    textAlign: "right",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.slate600,
    marginBottom: 8,
    textAlign: "right",
  },
  inputField: {
    borderWidth: 1,
    borderColor: COLORS.slate300,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlign: "right",
    color: COLORS.slate800,
    backgroundColor: "#f8fafc",
  },
  modalActions: {
    flexDirection: "row", // الزرارين جنب بعض
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: COLORS.slate200,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
  },
  cancelBtnText: {
    color: COLORS.slate700,
    fontWeight: "bold",
    fontSize: 16,
  },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
