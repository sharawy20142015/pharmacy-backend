import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
// 👇 1. استيراد Image من expo-image
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./Header.styles";
import { COLORS } from "../../../theme/colors";
import { useCart } from "../../../context/CartContext";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const navigation = useNavigation();
  const { cartItems } = useCart();

  const { user } = useAuth();

  const handleProfilePress = () => {
    if (user) {
      navigation.navigate("Account", { screen: "Profile" });
    } else {
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

          {/* أيقونة البروفايل */}
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
                // 👇 2. استخدام expo-image لعرض صورة المستخدم
                <Image
                  source={user.avatar_url} // تمرير الرابط مباشرة
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover" // عشان الصورة تملا الدائرة بالكامل
                  transition={200} // ظهور ناعم
                  cachePolicy="memory-disk" // حفظ الصورة في الكاش
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
