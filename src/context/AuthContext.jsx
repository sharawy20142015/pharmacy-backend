import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // مفتاح التخزين الموحد
  const STORAGE_KEY = "userData";

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      let authDataSerialized;

      // التبديل بين الويب والموبايل
      if (Platform.OS === "web") {
        authDataSerialized = window.localStorage.getItem(STORAGE_KEY);
      } else {
        authDataSerialized = await AsyncStorage.getItem(STORAGE_KEY);
      }

      if (authDataSerialized) {
        const _user = JSON.parse(authDataSerialized);
        // التأكد من أن البيانات تحتوي على الـ role قبل تعيينها
        setUser(_user);
        console.log(
          "🔐 AuthContext: User loaded from storage:",
          _user.email,
          "Role:",
          _user.role,
        );
      } else {
        console.log("ℹ️ AuthContext: No user found in storage.");
      }
    } catch (error) {
      console.error("❌ AuthContext: Error loading storage data", error);
    } finally {
      // صمام الأمان: نوقف التحميل مهما كانت النتيجة لتظهر شاشة اللوجن أو المتجر
      setIsLoading(false);
    }
  };

  // دالة تسجيل الدخول
  const login = async (userData) => {
    try {
      // نحدث الحالة فوراً (مهم جداً للـ Navigator)
      setUser(userData);

      const stringifiedData = JSON.stringify(userData);

      if (Platform.OS === "web") {
        window.localStorage.setItem(STORAGE_KEY, stringifiedData);
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, stringifiedData);
      }

      console.log("✅ AuthContext: Login successful for:", userData.role);
    } catch (error) {
      console.error("❌ AuthContext: Error saving login data", error);
    }
  };

  // دالة تسجيل الخروج
  const logout = async () => {
    try {
      setUser(null);
      if (Platform.OS === "web") {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
      console.log("👋 AuthContext: Logout successful");
    } catch (error) {
      console.error("❌ AuthContext: Error during logout", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
