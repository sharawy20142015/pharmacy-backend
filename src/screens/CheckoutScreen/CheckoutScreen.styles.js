import { StyleSheet, Platform } from "react-native";

export const COLORS = {
  primary: "#11b67f",
  secondary: "#0f172a",
  background: "#f8fafc",
  white: "#ffffff",
  border: "#e2e8f0",
  textLight: "#64748b",
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainContainer: {
    padding: 20,
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  flexWrapper: {
    gap: 30,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    width: "100%",
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  useSavedBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dcfce7",
    marginBottom: 15,
    gap: 8,
  },
  useSavedText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row-reverse",
    gap: 15,
    marginBottom: 15,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: 8,
    textAlign: "right",
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    fontSize: 15,
    color: COLORS.secondary,
    textAlign: "right",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  // 🟢 ستايل الـ Picker (Select)
  pickerWrapper: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    height: 55,
  },
  disabledPicker: {
    backgroundColor: "#f1f5f9",
    opacity: 0.6,
  },
  picker: {
    width: "100%",
    height: "100%",
    color: COLORS.secondary,
    textAlign: "right", // 🟢 لضمان المحاذاة في الويب
    direction: "rtl", // 🟢 لضمان اتجاه العناصر في الويب
    backgroundColor: "transparent",
    ...Platform.select({
      web: { outlineStyle: "none", border: "none" },
    }),
  },

  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  countryCode: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countryCodeText: {
    fontWeight: "bold",
    color: COLORS.secondary,
    fontSize: 15,
  },
  paymentCard: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  paymentInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  paymentText: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.secondary,
  },

  // 🟢 ستايل المنتجات في الفاتورة
  summaryItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 15,
  },
  summaryItemImgBox: {
    width: 65,
    height: 65,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.secondary,
    textAlign: "right",
    marginBottom: 5,
  },
  summaryItemPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  qtyBtn: {
    padding: 5,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 12,
    color: COLORS.secondary,
  },

  // 🟢 النقاط والفاتورة
  loyaltyBox: {
    backgroundColor: "#fff9eb",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#fef3c7",
  },
  loyaltyHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loyaltyTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#b45309",
    textAlign: "right",
  },
  loyaltySub: {
    fontSize: 13,
    color: "#d97706",
    textAlign: "right",
    marginTop: 2,
  },
  breakdownRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  breakdownVal: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  totalVal: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
  },
  mainBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 15,
    gap: 10,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  mainBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledBtn: {
    opacity: 0.7,
  },
});
