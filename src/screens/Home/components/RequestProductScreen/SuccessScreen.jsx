import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const SuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // جلب البيانات المرسلة من الصفحة السابقة
  const { orderNumber, type } = route.params || {
    orderNumber: "REQ-XXXXX",
    type: "request",
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* أيقونة النجاح المتحركة بصرياً */}
        <View style={styles.iconCircle}>
          <MaterialIcons name="check-circle" size={90} color="#10b77f" />
        </View>

        <Text style={styles.title}>تم استلام طلبك بنجاح!</Text>
        <Text style={styles.message}>
          شكراً لثقتك بنا. لقد تم تسجيل طلبك في نظامنا، وسيقوم فريق صيدلية
          الشعراوي بالبحث عن المنتج والتواصل معك في أقرب وقت.
        </Text>

        {/* عرض رقم الطلب بشكل مميز */}
        <View style={styles.orderCard}>
          <Text style={styles.orderLabel}>رقم الطلب الخاص بك</Text>
          <Text style={styles.orderNumber}>{orderNumber}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("Home")} // تأكد أن الاسم يطابق الـ Navigator عندك
            activeOpacity={0.8}
          >
            <Text style={styles.homeButtonText}>العودة للرئيسية</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>إرسال طلب جديد</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 500,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e6f7f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  orderCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    marginBottom: 40,
  },
  orderLabel: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 8,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  orderNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: "#10b77f",
    letterSpacing: 2,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  homeButton: {
    backgroundColor: "#10b77f",
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#10b77f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  homeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SuccessScreen;
