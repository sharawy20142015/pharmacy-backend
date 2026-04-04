import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Image,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./Header.styles";
import { COLORS } from "../../../theme/colors";
import { useCart } from "../../../context/CartContext";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const navigation = useNavigation();
  const { cartItems } = useCart();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      let userData = null;
      if (Platform.OS === "web") {
        const sessionData = window.sessionStorage.getItem("userData");
        userData = sessionData ? JSON.parse(sessionData) : null;
      }

      if (!userData) {
        const localData = await AsyncStorage.getItem("userData");
        userData = localData ? JSON.parse(localData) : null;
      }

      setUser(userData);
    };

    checkUser();
    const interval = setInterval(checkUser, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- 👇 الدالة الذكية للتنقل بناءً على حالة المستخدم ---
  const handleProfilePress = () => {
    if (user) {
      // لو مسجل دخول، وديه للـ Profile مباشرة جوه الـ Account Stack
      navigation.navigate("Account", { screen: "Profile" });
    } else {
      // لو مش مسجل، وديه لصفحة الـ Login
      navigation.navigate("Account", { screen: "Login" });
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        {/* --- اللوجو --- */}
        <View style={styles.leftGroup}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.logoSection}
          >
            <View style={styles.logoIconBox}>
              <MaterialIcons
                name="medical-services"
                size={24}
                color={COLORS.white}
              />
            </View>
            <Text style={styles.logoText}>
              Nabd <Text style={styles.logoTextHighlight}>Pharmacy</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- الأزرار اليمنى --- */}
        <View style={styles.rightGroup}>
          {/* <TouchableOpacity style={styles.iconCircle}>
            <MaterialIcons name="search" size={24} color={COLORS.slate700} />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.navigate("Cart")}
          >
            <MaterialIcons
              name="shopping-cart"
              size={22}
              color={COLORS.slate700}
            />
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* 👇 أيقونة البروفايل المحدثة بالمنطق الجديد */}
          <TouchableOpacity
            style={[
              styles.iconCircle,
              user && {
                borderWidth: 1.5,
                borderColor: COLORS.primary,
                overflow: "hidden",
              },
            ]}
            onPress={handleProfilePress}
          >
            {user ? (
              user.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Text>
              )
            ) : (
              <MaterialIcons
                name="person-outline"
                size={24}
                color={COLORS.slate700}
              />
            )}
          </TouchableOpacity>

          {isDesktop && user && (
            <TouchableOpacity onPress={handleProfilePress}>
              <Text
                style={{
                  marginLeft: 5,
                  color: COLORS.slate700,
                  fontWeight: "600",
                }}
              >
                {user.name.split(" ")[0]}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;
