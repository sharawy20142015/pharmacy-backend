import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useGoogleLogin } from "@react-oauth/google";

// ✅ استيراد الـ useAuth لاستخدام دالة الـ login المركزية
import { useAuth } from "../../context/AuthContext";
// ✅ استيراد apiClient
import apiClient from "../../services/apiClient";

// استيراد الاستايلات والألوان
import { styles, COLORS } from "./LoginStyles";

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // جلب دالة الـ login من الـ Context

  // --- دالة جوجل المحدثة ---
  const handleGoogleLoginWeb = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // 1. جلب بيانات اليوزر من جوجل
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const userInfo = await userInfoResponse.json();

        // 2. تجهيز الـ Payload لإرساله للباك إند
        const payload = {
          google_id: String(userInfo.sub),
          email: String(userInfo.email),
          name: String(userInfo.name || "User"),
          avatar_url: userInfo.picture ? String(userInfo.picture) : null,
        };

        // 3. إرسال البيانات للباك إند
        const response = await apiClient.post("/auth/google", payload);

        // تأكد أن الباك إند يرجع كائن يحتوي على (user) وداخله الـ (role)
        const userData = response.data.user;
        const userToken = response.data.access_token;

        // دمج التوكن مع بيانات اليوزر قبل حفظها
        const fullUserData = { ...userData, token: userToken };

        // 4. ✅ استخدام دالة الـ login المركزية (هي ستتولى الحفظ والتوجيه)
        await login(fullUserData);

        // ملاحظة: مفيش داعي لعمل navigation.navigate هنا
        // لأن AppNavigator هيغير الشاشة لوحده بناءً على الـ role

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Login Error:", error?.response?.data || error.message);
        Alert.alert(
          "خطأ",
          "فشل الاتصال بالسيرفر، تأكد من تشغيل الباك إند وصحة البيانات",
        );
      }
    },
    onError: () => {
      setIsLoading(false);
      Alert.alert("خطأ", "فشل تسجيل الدخول بواسطة جوجل");
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <MaterialIcons
                name="local-pharmacy"
                size={36}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.appName}>Nabd Pharmacy</Text>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Access your medical profile securely using your Google account
            </Text>
          </View>

          {/* Google Login Button */}
          <View style={[styles.formSection, { marginBottom: 20 }]}>
            <TouchableOpacity
              style={[
                styles.loginBtn,
                {
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.slate200,
                },
              ]}
              onPress={() => {
                setIsLoading(true);
                handleGoogleLoginWeb();
              }}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
                }}
                style={{ width: 24, height: 24, marginRight: 12 }}
              />
              <Text style={[styles.loginBtnText, { color: COLORS.slate700 }]}>
                Sign in with Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerIconBox}>
              <MaterialIcons name="verified-user" size={20} color="white" />
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>SECURE ACCESS</Text>
              <Text style={styles.bannerText}>
                Your data is protected. Join the Chronic Disease Program to{" "}
                <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
                  save up to 20%
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.footerText}>Need help?</Text>
            <TouchableOpacity>
              <Text style={styles.signUpLink}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.copyrightText}>
          © 2026 Nabd Pharmacy Medical Portal. All rights reserved.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
