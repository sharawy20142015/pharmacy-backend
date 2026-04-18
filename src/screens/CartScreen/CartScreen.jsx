import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  useWindowDimensions,
  Pressable,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./CartScreen.styles";
import Header from "../../components/UI/Header/Header";
import Footer from "../../components/UI/Footer/Footer";
import { useCart } from "../../context/CartContext";

// --- كارت المنتج داخل السلة ---
const CartItem = ({ item, onUpdateQty, onRemove, isMobile }) => {
  let imageUri = "https://via.placeholder.com/150";

  try {
    if (Array.isArray(item.images) && item.images.length > 0) {
      imageUri = item.images[0];
    } else if (typeof item.images === "string" && item.images.startsWith("[")) {
      const parsed = JSON.parse(item.images);
      if (parsed.length > 0) imageUri = parsed[0];
    } else {
      imageUri =
        item.img_url1 ||
        item.main_image ||
        item.img ||
        item.image ||
        (typeof item.images === "string" ? item.images : imageUri);
    }
  } catch (e) {
    imageUri = item.img_url1 || item.img || imageUri;
  }

  const title = item.ar_name || item.en_name || item.title || "Unknown Product";
  const price = item.final_price ?? item.price ?? 0;

  return (
    <Pressable
      style={[
        styles.cartItem,
        isMobile ? styles.cartItemCol : styles.cartItemRow,
      ]}
    >
      {({ hovered }) => (
        <>
          <View
            style={[
              styles.itemImgBox,
              isMobile ? styles.itemImgBoxMobile : styles.itemImgBoxDesktop,
            ]}
          >
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.itemImg,
                hovered && { transform: [{ scale: 1.05 }] },
                Platform.OS === "web" && {
                  transition: "transform 0.3s ease-in-out",
                },
              ]}
              resizeMode="contain"
            />
          </View>

          <View style={styles.itemDetails}>
            <View
              style={[
                styles.itemHeader,
                isMobile ? styles.itemHeaderCol : styles.itemHeaderRow,
              ]}
            >
              <View style={{ flex: 1, paddingRight: isMobile ? 0 : 10 }}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {title}
                </Text>
                <Text style={styles.itemDesc} numberOfLines={1}>
                  {item.Brand_Name || item.header || "Pharmacy Product"}
                </Text>
              </View>
              <Text style={styles.itemPrice}>EGP {price.toFixed(2)}</Text>
            </View>

            <View style={styles.itemActions}>
              <View style={styles.qtyBox}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() =>
                    onUpdateQty(item.id, Math.max(1, item.qty - 1))
                  }
                >
                  <MaterialIcons name="remove" size={18} color="#64748b" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => onUpdateQty(item.id, item.qty + 1)}
                >
                  <MaterialIcons name="add" size={18} color="#64748b" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => onRemove(item.id)} // 🟢 الحدث هنا سيشغل GTM تلقائياً من الـ Context
              >
                <MaterialIcons name="delete" size={18} color="#ef4444" />
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
};

// --- الشاشة الرئيسية للسلة ---
const CartScreen = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  // 🟢 استدعاء الدوال من الـ Context (التي تحتوي الآن على منطق GTM)
  const { cartItems, updateQty, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState("");

  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.final_price ?? item.price ?? 0) * item.qty,
    0,
  );

  const deliveryFee = 0;
  const total = subtotal;

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <MaterialIcons name="shopping-basket" size={64} color="#cbd5e1" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.startShoppingBtn}
            onPress={() => navigation.navigate("Store")}
          >
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
        <Footer />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainWrapper}>
          <View
            style={[
              styles.layoutContainer,
              !isDesktop && styles.layoutContainerMobile,
            ]}
          >
            <View style={styles.itemsSection}>
              <View
                style={[
                  styles.pageHeader,
                  isMobile && { borderBottomWidth: 0, marginBottom: 16 },
                ]}
              >
                <View>
                  <Text style={styles.pageTitle}>Shopping Cart</Text>
                  {!isMobile && (
                    <Text style={styles.pageSubtitle}>
                      Review your items before proceeding to checkout
                    </Text>
                  )}
                </View>

                {!isMobile && (
                  <Text style={styles.itemsCount}>
                    {cartItems.length} Items
                  </Text>
                )}
              </View>

              <View style={styles.itemsList}>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQty={updateQty}
                    onRemove={removeFromCart} // 🟢 الربط هنا
                    isMobile={isMobile}
                  />
                ))}
              </View>
            </View>

            {/* Order Summary */}
            <View
              style={[
                styles.summarySection,
                isDesktop ? styles.summarySectionDesktop : null,
              ]}
            >
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Order Summary</Text>

                <View style={styles.promoSection}>
                  <View style={styles.promoInputRow}>
                    <TextInput
                      style={styles.promoInput}
                      placeholder="Promo code"
                      value={promoCode}
                      onChangeText={setPromoCode}
                      placeholderTextColor="#94a3b8"
                    />
                    <TouchableOpacity style={styles.promoBtn}>
                      <Text style={styles.promoBtnText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.breakdownSection}>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Subtotal</Text>
                    <Text style={styles.breakdownVal}>
                      EGP {subtotal.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Delivery Fee</Text>
                    <Text
                      style={[
                        styles.breakdownVal,
                        { color: "#11b67f", fontSize: 12 },
                      ]}
                    >
                      Calculated at checkout
                    </Text>
                  </View>
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalVal}>EGP {total.toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() =>
                    navigation.navigate("Checkout", { expressItem: null })
                  }
                >
                  <Text style={styles.checkoutBtnText}>Checkout Now</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>

                <View style={styles.trustBadges}>
                  <View style={styles.trustBadgeItem}>
                    <MaterialIcons name="lock" size={18} color="#94a3b8" />
                    <Text style={styles.trustBadgeText}>SECURE</Text>
                  </View>
                  <View style={styles.trustBadgeItem}>
                    <MaterialIcons
                      name="local-shipping"
                      size={18}
                      color="#94a3b8"
                    />
                    <Text style={styles.trustBadgeText}>FAST</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;
