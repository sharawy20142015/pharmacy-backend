import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    // 👇 بدل الارتفاع الثابت، بنستخدم نسبة وتناسب (Aspect Ratio)
    // 16:9 أو 2:1 دي نسب ممتازة للموبايل عشان البانر ياخد حقه
    aspectRatio: 2 / 1,
    backgroundColor: "#e2e8f0",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  containerDesktop: {
    // 👇 في الديسكتوب الشاشة عريضة جداً، فبنخلي البانر أعرض عشان الصورة متتقصش كتير
    // نسبة 3:1 (العرض 3 أضعاف الارتفاع) ممتازة للبانرات الكبيرة على الويب
    aspectRatio: 3 / 1,
    // ممكن كمان تحط ماكس هايت لو مش عاوزه يكبر أوي في الشاشات العملاقة
    maxHeight: 500,
  },
  imageWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  touchable: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
