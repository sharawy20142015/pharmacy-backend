import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // 👈 1. استيراد الـ Navigation
import { styles } from "./RequestProduct.styles";

// لو حابب تستخدم ألوان الـ Theme الخاصة بيك بدل الألوان الثابتة، شيل الكومنت عن السطر اللي تحت
// import { COLORS } from "../../../theme/colors";

const RequestProduct = () => {
  const navigation = useNavigation(); // 👈 2. تعريف الـ Navigation

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>بتدور على منتج ناقص؟ 📦</Text>
        <Text style={styles.subtitle}>
          اطلب أي دواء أو منتج غير متوفر في الموقع وسنعمل علي توفيره لك بأسرع
          وقت.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => {
          // 👈 3. أمر الانتقال للشاشة الجديدة
          navigation.navigate("RequestProductScreen");
        }}
      >
        <Text style={styles.buttonText}>اطلب الآن</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RequestProduct;
