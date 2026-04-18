import React, { useEffect, useRef } from "react"; // 🟢 ضفنا useEffect و useRef
import { NavigationContainer } from "@react-navigation/native";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as Linking from "expo-linking";

// 1. استيراد الـ Providers (بما فيهم الـ LoadingProvider الجديد)
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { LoadingProvider } from "./src/context/LoadingContext"; // 👈 المايسترو الجديد

// استيراد AppNavigator
import AppNavigator from "./src/navigation/TabNavigator";

// 🟢 استيراد دوال GTM اللي عملناها
import { initGTM, logGTMEvent } from "./src/utils/analytics";

const linking = {
  prefixes: [
    Linking.createURL("/"),
    "http://localhost:8081",
    "http://10.100.16.30:8081",
    "http://54.234.4.149:8081",
    "https://pharmacy-app-domain.com", // ضيف الدومين بتاعك هنا
  ],
  config: {
    screens: {
      AdminDashboard: "admin/dashboard",
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
      Login: "login",
      ProductDetails: "product/:productId",
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
      RequestProductScreen: "request-product",
    },
  },
};

export default function App() {
  // 🟢 إنشاء References عشان نتتبع مسار الشاشات
  const navigationRef = useRef();
  const routeNameRef = useRef();

  // 🟢 حقن سكريبت جوجل أول ما التطبيق يفتح
  useEffect(() => {
    initGTM();
  }, []);

  return (
    <GoogleOAuthProvider clientId="862508946163-tc53fo7jqb5ckq5tq48po8lqpimp8dnv.apps.googleusercontent.com">
      {/* 2. الـ LoadingProvider لازم يلف كل الـ Providers عشان يتحكم في الشاشة كلها */}
      <LoadingProvider>
        <AuthProvider>
          <CartProvider>
            <NavigationContainer
              ref={navigationRef} // 🟢 ربط الـ Ref بالـ Navigation
              linking={linking}
              fallback={null} // يمنع الوميض الأبيض أثناء التحميل
              // 🟢 تسجيل حدث (page_view) لأول شاشة تفتح
              onReady={() => {
                routeNameRef.current =
                  navigationRef.current.getCurrentRoute().name;
                logGTMEvent("page_view", { page_path: routeNameRef.current });
              }}
              // 🟢 تسجيل حدث (page_view) مع كل تغيير للشاشة
              onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName =
                  navigationRef.current.getCurrentRoute().name;

                if (previousRouteName !== currentRouteName) {
                  logGTMEvent("page_view", { page_path: currentRouteName });
                }

                // تحديث اسم الشاشة للمرة الجاية
                routeNameRef.current = currentRouteName;
              }}
            >
              <AppNavigator />
            </NavigationContainer>
          </CartProvider>
        </AuthProvider>
      </LoadingProvider>
    </GoogleOAuthProvider>
  );
}
