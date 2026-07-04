import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as Linking from "expo-linking";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { LoadingProvider } from "./src/context/LoadingContext";

import AppNavigator from "./src/navigation/TabNavigator";
import { initGTM, logGTMEvent } from "./src/utils/analytics";

const queryClient = new QueryClient();

// إعدادات اللينكات (Deep Linking & Web Routing)
const linking = {
  prefixes: [
    Linking.createURL("/"),
    "http://localhost:8081",
    "http://10.100.16.30:8081",
    "http://54.234.4.149:8081",
    "https://nabdpharmacy.com",
    "https://www.nabdpharmacy.com",
  ],
  config: {
    initialRouteName: "MainTabs",
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
            screens: { Profile: "profile" },
          },
        },
      },
      Login: "login",
      // تم إعادتها للـ Root لتتطابق مع مكانها في AppNavigator
      ProductDetails: "product/:productId",
      PackageDetails: "package/:bundleId",
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
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <AuthProvider>
            <CartProvider>
              <NavigationContainer
                ref={navigationRef}
                linking={linking}
                fallback={null}
                onReady={() => {
                  if (navigationRef.current) {
                    routeNameRef.current =
                      navigationRef.current.getCurrentRoute()?.name;
                    logGTMEvent("page_view", {
                      page_path: routeNameRef.current,
                    });
                  }
                }}
                onStateChange={async () => {
                  if (navigationRef.current) {
                    const previousRouteName = routeNameRef.current;
                    const currentRouteName =
                      navigationRef.current.getCurrentRoute()?.name;

                    if (previousRouteName !== currentRouteName) {
                      logGTMEvent("page_view", { page_path: currentRouteName });
                    }
                    routeNameRef.current = currentRouteName;
                  }
                }}
              >
                <AppNavigator />
              </NavigationContainer>
            </CartProvider>
          </AuthProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
