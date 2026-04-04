import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  ScrollView,
  Linking,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons"; // ضفنا فونت أوسم عشان لوجو الواتساب
import {
  useNavigation,
  useRoute,
  CommonActions,
} from "@react-navigation/native";

const SuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  // استلام البيانات
  const { orderNumber, points, paymentMethod, totalAmount } = route.params || {
    orderNumber: "N/A",
    points: 0,
    paymentMethod: "Cash",
    totalAmount: 0,
  };

  const WALLET_NUMBER = "01015143047"; // 🟢 حط رقم فودافون كاش بتاعك هنا

  // دالة فتح الواتساب
  const handleWhatsAppAction = () => {
    const message = `Nabd Pharmacy، لتأكيد دفع طلب الأوردر رقم : ${orderNumber}\nالمبلغ: ${totalAmount} EGP`;
    const url = `whatsapp://send?phone=+2${WALLET_NUMBER}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("تطبيق واتساب غير مثبت على جهازك");
      }
    });
  };

  const handleGoHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "MainTabs", params: { screen: "Home" } }],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, isDesktop && styles.cardDesktop]}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name="check-circle"
              size={isDesktop ? 100 : 80}
              color="#11b67f"
            />
          </View>

          <Text style={styles.title}>تم الطلب بنجاح! 🎉</Text>

          {/* 🟢 الجزء الخاص بالدفع بالمحفظة */}
          {paymentMethod === "Wallet" ? (
            <View style={styles.walletBox}>
              <Text style={styles.walletHeader}>خطوة أخيرة لتأكيد طلبك:</Text>
              <Text style={styles.walletInstructions}>
                يرجى تحويل مبلغ{" "}
                <Text style={styles.amountText}>{totalAmount} EGP</Text> إلى
                الرقم التالي:
              </Text>
              <View style={styles.numberBadge}>
                <Text style={styles.phoneNumber}>{WALLET_NUMBER}</Text>
                <MaterialIcons name="content-copy" size={18} color="#11b67f" />
              </View>
              <Text style={styles.walletNote}>
                بمجرد التحويل، اضغط على الزرار بالأسفل لإرسال صورة التحويل عبر
                واتساب لتنفيذ طلبك فوراً.
              </Text>

              <TouchableOpacity
                style={styles.whatsappBtn}
                onPress={handleWhatsAppAction}
              >
                <FontAwesome name="whatsapp" size={24} color="#fff" />
                <Text style={styles.whatsappBtnText}>
                  إرسال صورة التحويل (واتساب)
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.subtitle}>
              شكراً لثقتك في صيدليتنا. أوردرك الآن قيد المراجعة وسيصلك في أقرب
              وقت.
            </Text>
          )}

          <View style={styles.orderBox}>
            <Text style={styles.orderLabel}>رقم الطلب:</Text>
            <Text style={styles.orderValue}>{orderNumber}</Text>
          </View>

          <View style={styles.pointsBox}>
            <MaterialIcons name="stars" size={24} color="#EAB308" />
            <Text style={styles.pointsText}>
              مبروك! ستحصل على{" "}
              <Text style={{ fontWeight: "bold" }}>{points}</Text> نقطة فور
              استلامك الطلب.
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleGoHome}>
            <Text style={styles.buttonText}>العودة للرئيسية</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  cardDesktop: {
    padding: 40,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  iconContainer: { marginBottom: 15 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },

  // 🟢 استايلات محفظة الدفع
  walletBox: {
    backgroundColor: "#f0fdf4",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  walletHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 10,
    textAlign: "center",
  },
  walletInstructions: {
    fontSize: 14,
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 10,
  },
  amountText: { fontWeight: "bold", color: "#11b67f", fontSize: 18 },
  numberBadge: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  phoneNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 2,
  },
  walletNote: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 18,
  },
  whatsappBtn: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginTop: 15,
    gap: 10,
  },
  whatsappBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },

  orderBox: {
    backgroundColor: "#f1f5f9",
    padding: 15,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  orderLabel: { color: "#64748b", fontSize: 13, marginBottom: 4 },
  orderValue: { fontSize: 20, fontWeight: "bold", color: "#11b67f" },
  pointsBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEFCE8",
    padding: 14,
    borderRadius: 16,
    marginBottom: 25,
    width: "100%",
    borderWidth: 1,
    borderColor: "#FEF08A",
  },
  pointsText: { color: "#854D0E", marginLeft: 12, flex: 1, fontSize: 13 },
  button: {
    backgroundColor: "#0f172a",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default SuccessScreen;
