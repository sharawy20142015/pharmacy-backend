import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useGoogleLogin } from "@react-oauth/google";

// ✅ استيراد الـ useAuth لاستخدام دالة الـ login المركزية
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import { styles, COLORS } from "./LoginStyles";

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  const { login } = useAuth();

  // --- دالة جوجل ---
  const handleGoogleLoginWeb = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const userInfo = await userInfoResponse.json();

        const payload = {
          google_id: String(userInfo.sub),
          email: String(userInfo.email),
          name: String(userInfo.name || "User"),
          avatar_url: userInfo.picture ? String(userInfo.picture) : null,
        };

        const response = await apiClient.post("/auth/google", payload);
        const userData = response.data.user;
        const userToken = response.data.access_token;
        const fullUserData = { ...userData, token: userToken };

        await login(fullUserData);
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
    onError: (error) => {
      setIsLoading(false);
      console.log("Google Login Failed", error);
      Alert.alert("خطأ", "فشل تسجيل الدخول بواسطة جوجل");
    },
  });

  return (
    <View style={styles.mainContainer}>
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
              Please login to your medical account securely
            </Text>
          </View>

          {/* Google Login Section */}
          <View style={styles.formSection}>
            <TouchableOpacity
              style={styles.primaryGoogleBtn}
              onPress={() => {
                setIsLoading(true);
                handleGoogleLoginWeb();
              }}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg",
                }}
                style={{ width: 24, height: 24, marginRight: 12 }}
                contentFit="contain"
              />
              <Text style={styles.primaryGoogleBtnText}>
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Marketing Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerIconBox}>
              <MaterialIcons
                name="verified-user"
                size={20}
                color={COLORS.white}
              />
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>SECURE ACCESS</Text>
              <Text style={styles.bannerText}>
                Join the Chronic Disease Program and{" "}
                <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
                  save up to 20%
                </Text>
              </Text>
            </View>
          </View>

          {/* Footer */}
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

      {/* RTL Toggle FAB */}
      <TouchableOpacity
        style={styles.rtlFab}
        onPress={() => setIsRTL(!isRTL)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="translate" size={24} color={COLORS.slate600} />
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
