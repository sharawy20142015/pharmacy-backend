import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const STORAGE_KEY = "userData";

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      let authDataSerialized;

      if (Platform.OS === "web") {
        authDataSerialized = window.localStorage.getItem(STORAGE_KEY);
      } else {
        authDataSerialized = await AsyncStorage.getItem(STORAGE_KEY);
      }

      if (authDataSerialized) {
        const _user = JSON.parse(authDataSerialized);
        setUser(_user);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      setUser(userData);
      const stringifiedData = JSON.stringify(userData);

      if (Platform.OS === "web") {
        window.localStorage.setItem(STORAGE_KEY, stringifiedData);
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, stringifiedData);
      }
    } catch (error) {}
  };

  const logout = async () => {
    try {
      setUser(null);
      if (Platform.OS === "web") {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
