import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // ترتيب العناصر بجانب بعضها
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F9FF", // لون خلفية أزرق فاتح هادي جداً
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0F2FE", // إطار خفيف بيعطي لمسة شيك
    // إعدادات الظل عشان الكارت يكون بارز (متوافق مع أندرويد و iOS)
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  textContainer: {
    flex: 1,
    paddingRight: 12, // مسافة بين النص والزرار عشان ميكلوش في بعض
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0369A1", // لون أزرق صيدلي غامق للعنوان
    marginBottom: 6,
    textAlign: "right", // عشان التطبيق بالعربي
  },
  subtitle: {
    fontSize: 12,
    color: "#475569", // لون رمادي غامق للنص الفرعي لسهولة القراءة
    textAlign: "right",
    lineHeight: 18,
  },
  button: {
    backgroundColor: COLORS.primary, // لون الزرار (أزرق بارز)
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
