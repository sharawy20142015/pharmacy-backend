// src/screens/PackageDetails/PackageDetailsScreen.styles.js

import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4fbf4", // نفس الـ background المريح المعتمد لسهولة الرؤية
  },
  header: {
    height: 70,
    backgroundColor: "rgba(244, 251, 244, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(187, 202, 192, 0.3)",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#161d19",
    fontFamily: "Tajawal_700Bold",
  },

  // كلاس الـ ScrollView لتقييد الارتفاع الخارجي وتأمين عملية السكرول الحر
  scrollView: {
    flex: 1,
  },

  // حاوية المحتوى المحدثة لرفع الفاتورة والمنتجات كلياً فوق التاب بار السفلي للموبايل
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 140, // مسافة الأمان لرفع الفاتورة لمنع تداخل أزرار الموبايل
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
    flexGrow: 1, // إجبار المحتوى على تفعيل سكرول ديناميكي حر
  },
  mainLayout: {
    width: "100%",
    gap: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#161d19",
    marginVertical: 16,
    textAlign: "right",
    fontFamily: "Tajawal_700Bold",
  },

  // كارت الـ Hero العلوي النصي المطور
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(187, 202, 192, 0.2)",
    ...Platform.select({
      web: { boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.04)" },
      android: { elevation: 3 },
    }),
  },
  heroImageWrapper: {
    width: "100%",
    height: 280,
    backgroundColor: "#f8fafc",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroTextContent: {
    padding: 24,
    alignItems: "flex-end",
    flex: 1,
  },
  exclusiveBadge: {
    backgroundColor: "rgba(17, 182, 127, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
    alignSelf: "flex-end",
  },
  exclusiveBadgeText: {
    color: "#006c49",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Tajawal_700Bold",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#161d19",
    marginBottom: 12,
    textAlign: "right",
    fontFamily: "Tajawal_700Bold",
  },
  heroDesc: {
    fontSize: 14,
    color: "#3c4a42",
    lineHeight: 22,
    textAlign: "right",
    marginBottom: 20,
    fontFamily: "Tajawal_500Medium",
  },
  metaRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginTop: 16, // تم الإصلاح من auto لضمان عدم انكماش وطيران نصوص الكارد العلوي
  },
  metaItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: "#6c7a71",
    fontFamily: "Tajawal_500Medium",
  },
  metaDivider: {
    width: 4,
    height: 4,
    backgroundColor: "#bbcac0",
    borderRadius: 2,
  },

  // كروت المنتجات داخل المجموعات
  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(187, 202, 192, 0.2)",
    ...Platform.select({
      web: { transition: "opacity 0.2s ease, filter 0.2s ease" },
    }),
  },
  productCardUnselected: {
    opacity: 0.5,
    ...Platform.select({
      web: { filter: "grayscale(100%)" },
    }),
  },
  productThumbWrapper: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: "#e8f0e9",
    overflow: "hidden",
  },
  productThumb: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: "flex-end",
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#161d19",
    marginBottom: 4,
    fontFamily: "Tajawal_700Bold",
    textAlign: "right",
  },
  productDesc: {
    fontSize: 12,
    color: "#6c7a71",
    marginBottom: 8,
    fontFamily: "Tajawal_500Medium",
    textAlign: "right",
  },
  priceRow: {
    flexDirection: "row-reverse",
    gap: 8,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#006c49",
  },
  productOldPrice: {
    fontSize: 12,
    color: "#bbcac0",
    textDecorationLine: "line-through",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#bbcac0",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#11b67f",
    borderColor: "#11b67f",
  },

  // كارت ملخص الفاتورة الأنيق
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(187, 202, 192, 0.2)",
    ...Platform.select({
      web: { boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.04)" },
      android: { elevation: 3 },
    }),
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#161d19",
    marginBottom: 20,
    textAlign: "right",
    fontFamily: "Tajawal_700Bold",
  },
  summaryRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#3c4a42",
    fontFamily: "Tajawal_500Medium",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#161d19",
  },
  totalDivider: {
    height: 1,
    backgroundColor: "rgba(187, 202, 192, 0.3)",
    marginVertical: 16,
  },
  finalTotalRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#161d19",
    fontFamily: "Tajawal_700Bold",
  },
  finalTotalValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#006c49",
    lineHeight: 34,
  },
  finalTotalCurrency: {
    fontSize: 11,
    color: "#3c4a42",
    fontWeight: "700",
    fontFamily: "Tajawal_700Bold",
    textAlign: "right",
  },
  primaryCta: {
    backgroundColor: "#006c49",
    borderRadius: 999,
    height: 54,
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryCtaText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Tajawal_700Bold",
  },
  badgeGuarantee: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#eef5ee",
    borderRadius: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#161d19",
    fontFamily: "Tajawal_700Bold",
    textAlign: "right",
  },
  guaranteeSub: {
    fontSize: 10,
    color: "#3c4a42",
    fontFamily: "Tajawal_500Medium",
    textAlign: "right",
    marginTop: 2,
  },

  // 🟢 استايلات المودال (الـ Pop-up التحذيري) مدمجة هنا بالكامل وخالية من أي Inline Styles
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
  alertIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff9eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#161d19",
    marginBottom: 10,
    fontFamily: "Tajawal_700Bold",
  },
  modalMessage: {
    fontSize: 14,
    color: "#3c4a42",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 8,
    fontFamily: "Tajawal_500Medium",
  },
  alertActionBtn: {
    backgroundColor: "#006c49",
    width: "100%",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  alertActionBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Tajawal_700Bold",
  },
});
