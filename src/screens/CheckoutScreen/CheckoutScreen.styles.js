// src/screens/CheckoutScreen/CheckoutScreen.styles.js

import { StyleSheet, Platform } from "react-native";

export const COLORS = {
  primary: "#006c49", // الأخضر الملكي الفاخر للماتيريال
  primaryContainer: "#11b67f", // لون زرار التأكيد الـ CTA الساطع
  background: "#f4fbf4", // خلفية الشاشة الهادئة (Mint Tint)
  surfaceCard: "#ffffff", // لون الكروت البيضاء المرفوعة
  inputBackground: "#eef5ee", // لون خلفية الحقول والـ Pickers
  textMain: "#161d19", // لون النصوص الأساسية
  textSecondary: "#3c4a42", // لون النصوص الفرعية
  border: "#bbcac0", // لون الحدود الفاصلة الأنيقة
  tertiaryFixed: "#ffdad7", // لون خلفية صندوق المساعدة الوردي
  tertiaryText: "#a43b3a", // لون نصوص صندوق المساعدة
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(187, 202, 192, 0.3)",
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    fontFamily: "Tajawal_700Bold",
  },
  scrollContent: {
    paddingBottom: 60,
  },
  mainContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
    gap: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textMain,
    textAlign: "right",
    marginBottom: 8,
    fontFamily: "Tajawal_700Bold",
    paddingHorizontal: 8,
  },
  sectionCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(187, 202, 192, 0.2)",
    marginBottom: 24,
    ...Platform.select({
      web: { boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.04)" },
      default: {
        shadowColor: "rgba(15, 23, 42, 1)",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.04,
        shadowRadius: 30,
        elevation: 3,
      },
    }),
  },
  sectionCardOverflow: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(187, 202, 192, 0.2)",
    marginBottom: 24,
    overflow: "hidden",
    ...Platform.select({
      web: { boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.04)" },
      default: {
        shadowColor: "rgba(15, 23, 42, 1)",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.04,
        shadowRadius: 30,
        elevation: 3,
      },
    }),
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textMain,
    fontFamily: "Tajawal_700Bold",
  },

  // حقول الإدخال والـ Form
  row: {
    width: "100%",
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 6,
    textAlign: "right",
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: "rgba(187, 202, 192, 0.3)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    fontSize: 15,
    color: COLORS.textMain,
    textAlign: "right",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  // الـ Picker
  pickerWrapper: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: "rgba(187, 202, 192, 0.3)",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
  },
  disabledPicker: {
    backgroundColor: "#e2e8f0",
    opacity: 0.6,
  },
  picker: {
    width: "100%",
    color: COLORS.textMain,
    backgroundColor: "transparent",
    ...Platform.select({
      web: {
        height: "100%",
        paddingHorizontal: 16,
        outlineStyle: "none",
        border: "none",
        cursor: "pointer",
      },
      default: {
        height: 50,
      },
    }),
  },

  phoneInputRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: "rgba(187, 202, 192, 0.3)",
    borderRadius: 8,
    overflow: "hidden",
    height: 50,
  },
  countryCode: {
    backgroundColor: "rgba(187, 202, 192, 0.2)",
    paddingHorizontal: 16,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(187, 202, 192, 0.3)",
  },
  countryCodeText: {
    fontWeight: "600",
    color: COLORS.textSecondary,
    fontSize: 15,
  },

  // كروت وسائل الدفع (تم تحصينها وحل مشكلة الـ Overflow والمحاذاة للموبايل) 🟢
  paymentOption: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(187, 202, 192, 0.3)",
    backgroundColor: COLORS.surfaceCard,
    marginBottom: 12,
  },
  paymentLeftInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    flex: 1, // جعل الحاوية مرنة لتقييد النص الطويل داخل المساحة المتاحة
    paddingLeft: 8, // مسافة أمان لمنع التداخل مع الأيقونة اليسارية
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterActive: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textMain,
    flex: 1, // إجبار النص الطويل جداً على الالتفاف والنزول لسطر جديد تلقائياً
    textAlign: "right", // الحفاظ على محاذاة النص العربي جهة اليمين عند النزول
  },

  // صندوق المساعدة السفلي
  helpBox: {
    backgroundColor: COLORS.tertiaryFixed,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row-reverse",
    alignItems: "start",
    gap: 12,
    marginTop: 16,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.tertiaryText,
    textAlign: "right",
  },
  helpSub: {
    fontSize: 13,
    color: "#842325",
    textAlign: "right",
    marginTop: 4,
    lineHeight: 18,
  },

  // استايلات صفوف المنتجات بداخل كارت الفاتورة الجانبي
  orderListContainer: {
    maxHeight: 350,
    paddingHorizontal: 20,
  },
  summaryItemRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(187, 202, 192, 0.2)",
    gap: 16,
  },
  summaryItemImgBox: {
    width: 76,
    height: 72,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryItemImg: {
    width: "100%",
    height: "100%",
  },
  summaryItemInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  summaryItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMain,
    textAlign: "right",
    marginBottom: 6,
    lineHeight: 20,
  },
  summaryItemPriceQtyRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 4,
  },
  summaryItemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  qtyBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMain,
    minWidth: 16,
    textAlign: "center",
  },

  // استايل جدول الحساب المالي السفلي للفاتورة
  financialBreakdownBox: {
    backgroundColor: "rgba(238, 245, 238, 0.5)",
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(187, 202, 192, 0.2)",
  },
  breakdownRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  breakdownVal: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textMain,
  },
  totalDivider: {
    height: 1,
    backgroundColor: "rgba(187, 202, 192, 0.3)",
    marginVertical: 4,
  },
  finalTotalRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textMain,
  },
  finalTotalVal: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
  },

  // زر الإرسال الرئيسي الـ CTA
  ctaContainer: {
    padding: 20,
    backgroundColor: COLORS.surfaceCard,
  },
  mainBtn: {
    backgroundColor: COLORS.primaryContainer,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  mainBtnText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },
  disabledBtn: {
    opacity: 0.6,
  },

  // المودال الـ Pop-up
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  modalContent: {
    width: "90%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textMain,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  actionBtn: {
    backgroundColor: COLORS.primaryContainer,
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
