import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, View, ActivityIndicator, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// استيراد الـ Providers
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// الشاشات
import HomeScreen from "../screens/Home/HomeScreen";
import StoreScreen from "../screens/Store/StoreScreen";
import CartScreen from "../screens/CartScreen/CartScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen/ProductDetailsScreen";
import CheckoutScreen from "../screens/CheckoutScreen/CheckoutScreen";
import SuccessScreen from "../screens/Success/SuccessScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

// شاشة الإدارة
import OrderControlScreen from "../screens/Admin/OrderManagement/OrderControlScreen";

import { COLORS } from "../theme/colors";
import AdminControlScreen from "../screens/Admin/OrderManagement/AdminControlScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- 1. الـ Stacks الفرعية ---
const StoreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StoreMain" component={StoreScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </Stack.Navigator>
);

// --- 2. الـ Tab Navigator الموحد (للعميل والأدمن) ---
const TabNavigator = () => {
  const { user } = useAuth(); // نعرف مين اللي فاتح عشان نتحكم في التابات
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

      {/* 🛠️ تاب الإدارة: تظهر فقط لو المستخدم أدمن وبجانب باقي التابات */}
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

// --- 3. App Navigator الرئيسي ---
const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* دلوقتي التوجيه أصبح موحد: 
          الكل بيدخل على MainTabs، والـ TabNavigator هو اللي بيقرر يظهر تاب الإدارة ولا لا
      */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* شاشة اللوجن تظهر كـ Modal أو شاشة فوق التابات لو مش مسجل */}
      {!user && <Stack.Screen name="Login" component={LoginScreen} />}

      {/* شاشات إضافية */}
      <Stack.Group screenOptions={{ presentation: "card" }}>
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppNavigator;
