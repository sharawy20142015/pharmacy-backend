import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // خلفية فاتحة ومريحة للعين
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  // الكروت الخاصة بالأقسام
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    ...Platform.select({
      ios: {
        shadowColor: "#64748b",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  // عناوين الأقسام (بيانات المنتج، التسعير...)
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.slate800,
    marginBottom: 20,
    textAlign: "right",
    paddingRight: 12,
    borderRightWidth: 4,
    borderRightColor: COLORS.primary,
  },
  // بادج كود المنتج التلقائي
  skuBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  skuText: {
    marginRight: 8,
    color: "#0369a1",
    fontSize: 15,
    fontWeight: "600",
  },
  // نظام الشبكة (Grid) للمسافات بين الحقول
  row: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  column: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  // تنسيق الـ Label (العنوان فوق الخانة)
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.slate700,
    marginBottom: 8,
    textAlign: "right",
    marginRight: 4,
  },
  // تنسيق خانة الإدخال نفسها
  input: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 14,
    textAlign: "right",
    backgroundColor: "#fff",
    fontSize: 15,
    color: COLORS.slate900,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  // تنسيق مربعات اختيار الفئات (Categories)
  categoryItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryItemSelected: {
    backgroundColor: "#f0fdf4",
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  categoryText: {
    marginRight: 10,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.slate700,
  },
  // تنسيق صفوف الـ Switch (تفعيل المنتج، مميز...)
  switchRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.slate800,
  },
  // زر الحفظ النهائي
  submitBtn: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
