// src/navigation/TabNavigator.jsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// استيراد الـ COLORS لتصليح كراش الـ ReferenceError فوراً
import { COLORS } from "../theme/colors";

// استيراد المكونات والـ Context
import LoadingScreen from "../components/UI/LoadingScreen/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLoading } from "../context/LoadingContext";

// الشاشات
import HomeScreen from "../screens/Home/HomeScreen";
import StoreScreen from "../screens/Store/StoreScreen";
import CartScreen from "../screens/CartScreen/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen/CheckoutScreen";
import SuccessScreen from "../screens/Success/SuccessScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import RequestProductScreen from "../screens/Home/components/RequestProductScreen/RequestProductScreen";
import AdminControlScreen from "../screens/Admin/OrderManagement/AdminControlScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen/ProductDetailsScreen";
import PackageDetailsScreen from "../screens/PackageDetails/PackageDetailsScreen";
// 🟢 1. استيراد شاشة جميع الباقات الجديدة بالمسار الصحيح
import AllBundlesScreen from "../screens/AllBundles/AllBundlesScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 🚀 كومبوننت معزول للـ Loading Overlay لمنع الـ Re-render للـ Navigator كله
const GlobalLoadingOverlay = () => {
  const { isGlobalLoading } = useLoading();

  if (!isGlobalLoading) return null;

  return (
    <View style={styles.overlayLoading}>
      <LoadingScreen />
    </View>
  );
};

// --- الـ Stacks الفرعية ---
const StoreStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: Platform.OS !== "web",
    }}
  >
    <Stack.Screen name="StoreMain" component={StoreScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: Platform.OS !== "web",
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />
    {/* 🟢 2. زرع الشاشة داخل الـ HomeStack عشان زرار "عرض الكل" يقدر ينادي عليها فوراً بسلاسة */}
    <Stack.Screen name="AllBundles" component={AllBundlesScreen} />
  </Stack.Navigator>
);

// --- الـ Tab Navigator الموحد ---
const TabNavigator = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const isAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "staff";

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
        },
        tabBarIcon: ({ color }) => {
          let iconName =
            route.name === "Home"
              ? "home"
              : route.name === "Store"
                ? "storefront"
                : route.name === "Cart"
                  ? "shopping-basket"
                  : route.name === "Admin"
                    ? "dashboard"
                    : "person";
          return <MaterialIcons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: "الرئيسية" }}
      />
      <Tab.Screen
        name="Store"
        component={StoreStack}
        options={{ title: "المتجر" }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminControlScreen}
          options={{ title: "الإدارة" }}
        />
      )}
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "السلة",
          tabBarBadge: totalItems > 0 ? totalItems : null,
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        options={{ title: "حسابي" }}
      />
    </Tab.Navigator>
  );
};

// --- App Navigator الرئيسي الكلي ---
const AppNavigator = () => {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: Platform.OS !== "web",
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        {!user && <Stack.Screen name="Login" component={LoginScreen} />}
        <Stack.Group screenOptions={{ presentation: "card" }}>
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
          />
          <Stack.Screen
            name="PackageDetails"
            component={PackageDetailsScreen}
          />
          {/* 🟢 3. زرع الشاشة داخل الـ Global Group عشان الـ Deep Linking والـ Web Mapping يقروها طلقة من الـ Root */}
          <Stack.Screen name="AllBundles" component={AllBundlesScreen} />
          <Stack.Screen
            name="RequestProductScreen"
            component={RequestProductScreen}
          />
        </Stack.Group>
      </Stack.Navigator>

      {/* الـ Overlay المعزول يشتغل لوحده فوق الشاشات */}
      <GlobalLoadingOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 9999,
    elevation: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppNavigator;
