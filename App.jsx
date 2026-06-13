// App.jsx

import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as Linking from "expo-linking";

// 1. استيراد الـ Providers
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { LoadingProvider } from "./src/context/LoadingContext";

// استيراد AppNavigator
import AppNavigator from "./src/navigation/TabNavigator";

// استيراد دوال GTM
import { initGTM, logGTMEvent } from "./src/utils/analytics";

const linking = {
  prefixes: [
    Linking.createURL("/"),
    "http://localhost:8081",
    "http://10.100.16.30:8081",
    "http://54.234.4.149:8081",
    "https://pharmacy-app-domain.com",
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

      // مسار تفاصيل باقة معينة بالـ ID
      PackageDetails: "package/:bundleId",

      // 🟢 التعديل السحري هنا: ضفنا مسار شاشة كل الباقات عشان الـ Deep Linking والويب يشتغلوا طلقة
      AllBundles: "all-bundles",

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
  const navigationRef = useRef();
  const routeNameRef = useRef();

  useEffect(() => {
    initGTM();
  }, []);

  return (
    <GoogleOAuthProvider clientId="862508946163-tc53fo7jqb5ckq5tq48po8lqpimp8dnv.apps.googleusercontent.com">
      <LoadingProvider>
        <AuthProvider>
          <CartProvider>
            <NavigationContainer
              ref={navigationRef}
              linking={linking}
              fallback={null}
              onReady={() => {
                routeNameRef.current =
                  navigationRef.current.getCurrentRoute().name;
                logGTMEvent("page_view", { page_path: routeNameRef.current });
              }}
              onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName =
                  navigationRef.current.getCurrentRoute().name;

                if (previousRouteName !== currentRouteName) {
                  logGTMEvent("page_view", { page_path: currentRouteName });
                }

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
