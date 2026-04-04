import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../theme/colors";

export { COLORS };

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.slate50, // لون خلفية أهدى وأشيك من الأبيض
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.slate50,
  },
  scrollContent: {
    paddingBottom: 60,
    paddingTop: Platform.OS === "web" ? 30 : 10,
  },
  mainContainer: {
    padding: 16,
    width: "100%",
    maxWidth: 650, // عرض مثالي بيلم الديزاين في الويب
    alignSelf: "center",
    gap: 20,
  },

  // ==========================================
  // 1. كارت المستخدم (Header)
  // ==========================================
  profileCard: {
    flexDirection: "row-reverse",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "space-between",
    ...Platform.select({
      web: { boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.04)" }, // ظل ناعم جداً
      android: { elevation: 3 },
    }),
  },
  profileInfoWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + "15", // خلفية خضراء شفافة 15%
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 22,
    color: COLORS.primary,
  },
  profileTextCol: {
    alignItems: "flex-end",
    flex: 1,
  },
  profileName: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 18,
    color: COLORS.slate900,
    textAlign: "right",
  },
  profileEmail: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 13,
    color: COLORS.slate500,
    marginTop: 4,
    textAlign: "right",
  },
  editProfileBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.slate50,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  editProfileText: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 13,
    color: COLORS.slate700,
  },

  // ==========================================
  // 2. كارت النقاط (Premium Stats)
  // ==========================================
  pointsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.04)" },
      android: { elevation: 3 },
    }),
  },
  pointsHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  pointsIconWrapper: {
    backgroundColor: COLORS.primary + "15",
    padding: 8,
    borderRadius: 12,
  },
  pointsTitle: {
    fontFamily: "Tajawal_700Bold",
    color: COLORS.slate700,
    fontSize: 16,
  },
  pointsBody: {
    alignItems: "center",
    marginBottom: 24,
  },
  pointsValue: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 54, // رقم ضخم ومميز
    color: COLORS.primary,
    marginBottom: 4,
  },
  pointsSubtitle: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 15,
    color: COLORS.slate500,
  },
  pendingBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.accentGold + "15",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
  },
  pendingText: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 13,
    color: "#b48600",
  },
  pointsBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row-reverse",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    ...Platform.select({
      web: { cursor: "pointer", transition: "all 0.2s ease" },
    }),
  },
  pointsBtnText: {
    fontFamily: "Tajawal_700Bold",
    color: COLORS.white,
    fontSize: 16,
  },

  // ==========================================
  // 3. قسم العنوان (Inputs & Dropdowns)
  // ==========================================
  addressSection: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      web: { boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.04)" },
      android: { elevation: 3 },
    }),
  },
  addressHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  addressTitleWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  addressTitle: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 18,
    color: COLORS.slate900,
  },
  addressEditText: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 14,
    color: COLORS.secondary,
  },

  // 🟢 السر كله هنا: توحيد شكل المدخلات والقوائم
  inputLabel: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 14,
    color: COLORS.slate600,
    marginBottom: 8,
    textAlign: "right",
  },
  input: {
    backgroundColor: COLORS.slate50,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54, // ارتفاع ثابت ومريح
    fontFamily: "Tajawal_500Medium",
    fontSize: 15,
    color: COLORS.slate900,
    textAlign: "right",
    marginBottom: 16,
    ...Platform.select({
      web: { outlineStyle: "none" }, // إخفاء الإطار الأسود في الويب
    }),
  },
  textArea: {
    height: 100,
    paddingVertical: 16,
    textAlignVertical: "top",
  },

  // 🟢 حاوية الـ Picker (Dropdown)
  pickerWrapper: {
    backgroundColor: COLORS.slate50,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 14,
    height: 54,
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden", // بيخفي حواف الـ select العادية
  },
  picker: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    borderWidth: 0, // إخفاء إطار الويب
    color: COLORS.slate900,
    fontFamily: "Tajawal_500Medium",
    fontSize: 15,
    paddingHorizontal: 12,
    direction: "rtl", // لضبط السهم والنص في الويب
    ...Platform.select({
      web: { outlineStyle: "none", cursor: "pointer" },
    }),
  },

  // 🟢 عرض العنوان الحالي
  addressDisplay: {
    backgroundColor: COLORS.slate50,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  addressTextMain: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 16,
    color: COLORS.slate900,
    textAlign: "right",
    marginBottom: 6,
  },
  addressTextDetails: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 14,
    color: COLORS.slate600,
    textAlign: "right",
    lineHeight: 22,
  },

  // ==========================================
  // 4. الدعم وتسجيل الخروج
  // ==========================================
  supportCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.04)" },
      android: { elevation: 3 },
    }),
  },
  logoutBtnFlat: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  logoutBtnFlatText: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 15,
    color: COLORS.red500,
  },
});
