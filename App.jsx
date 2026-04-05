import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as Linking from "expo-linking";

// استيراد الـ Providers
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";

// استيراد AppNavigator
import AppNavigator from "./src/navigation/TabNavigator";

const linking = {
  prefixes: [
    Linking.createURL("/"),
    "http://localhost:8081",
    "http://10.100.16.30:8081",
  ],
  config: {
    screens: {
      // 1. مسار الأدمن
      AdminDashboard: "admin/dashboard",

      // 2. مسارات العميل (داخل الـ TabNavigator)
      MainTabs: {
        path: "",
        screens: {
          Home: {
            path: "home",
            screens: { HomeMain: "" },
          },
          Store: {
            path: "store",
            screens: { StoreMain: "" },
          },
          Cart: "cart",
          Account: {
            path: "user",
            screens: {
              Profile: "profile",
            },
          },
        },
      },

      // 3. مسار تسجيل الدخول
      Login: "login",

      // 4. مسارات عامة
      ProductDetails: "product/:productId",

      // 🟢 مسار الـ Checkout
      Checkout: {
        path: "checkout",
        parse: {
          expressItem: (data) =>
            data ? JSON.parse(decodeURIComponent(data)) : null,
        },
        stringify: {
          expressItem: (data) =>
            data ? encodeURIComponent(JSON.stringify(data)) : "",
        },
      },

      SuccessScreen: "success",

      // 👇 🟢 المسار الجديد لشاشة طلب المنتج
      RequestProductScreen: "request-product",
    },
  },
};

export default function App() {
  return (
    <GoogleOAuthProvider clientId="862508946163-tc53fo7jqb5ckq5tq48po8lqpimp8dnv.apps.googleusercontent.com">
      {/* الـ Providers مرتبة لضمان أن كل سياق يرى الآخر */}
      <AuthProvider>
        <CartProvider>
          <NavigationContainer
            linking={linking}
            fallback={null} // يمنع الوميض الأبيض أثناء التحميل
          >
            <AppNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
