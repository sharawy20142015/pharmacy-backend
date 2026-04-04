import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const styles = StyleSheet.create({
  section: {
    marginBottom: 56,
    // يفضل تدي padding للموبايل من بره عشان العنوان ميكونش لازق في الشاشة
    paddingHorizontal: Platform.OS === "web" ? 0 : 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // بيخلي كلمة See all ماشية مع خط كلمة New Arrivals من تحت
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicator: {
    width: 6, // رفعناه شوية عشان الشياكة
    height: 32,
    backgroundColor: COLORS.primary || "#10b77f",
    borderRadius: 6, // دائرية أنعم
    marginRight: 12,
  },
  title: {
    fontSize: 26, // حجم ضخم
    fontWeight: "900", // أثقل وزن للخط (Black)
    color: "#0f172a", // لون أسود فخم جداً (Slate 900)
    letterSpacing: -0.5, // تقليل المسافة بين الحروف بيدي طابع الـ Typography الحديث
    textTransform: "capitalize",
  },
  seeAll: {
    color: COLORS.primary || "#10b77f",
    fontWeight: "800",
    fontSize: 15,
    marginBottom: 4, // تظبيط بصري عشان تبقى ماشية مع العنوان
  },
  scrollContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    // لو حاطط paddingHorizontal في الـ section فوق، شيلها من هنا عشان السكرول يكمل لآخر الشاشة بنعومة
  },
});
