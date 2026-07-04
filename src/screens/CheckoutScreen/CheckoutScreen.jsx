import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useCart } from "../../context/CartContext";
import { loyaltyService } from "../../services/loyaltyService";
import apiClient from "../../services/apiClient";
import { styles, COLORS } from "./CheckoutScreen.styles";

import ShippingForm from "./components/ShippingForm";
import OrderSummary from "./components/OrderSummary";
import { logGTMEvent } from "../../utils/analytics";

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();

  const { cartItems, clearCart, updateQty } = useCart();

  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedAddress, setSavedAddress] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [isUsingPoints, setIsUsingPoints] = useState(false);
  const [expressItem, setExpressItem] = useState(null);
  const [locations, setLocations] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertMsg, setCustomAlertMessage] = useState("");

  const [addressData, setAddressData] = useState({
    firstName: "",
    lastName: "",
    governorate: "",
    city: "",
    details: "",
    phone: "",
  });

  const isDesktop = width >= 1024;
  const itemsToRender = expressItem ? [expressItem] : cartItems;

  const subtotal = itemsToRender.reduce(
    (sum, item) =>
      sum +
      (Number(item.final_price || item.price) || 0) *
        (Number(item.qty || item.quantity) || 1),
    0,
  );
  const pointsDiscountMoney = isUsingPoints
    ? Number(loyaltyService.calculateMoney(userPoints))
    : 0;
  const total = Math.max(0, subtotal + deliveryFee - pointsDiscountMoney);

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        const locRes = await apiClient.get("/shipping/locations");
        setLocations(locRes.data);

        const paramItem = route.params?.expressItem;
        if (paramItem) {
          setExpressItem(paramItem);
          await AsyncStorage.setItem(
            "@express_checkout",
            JSON.stringify(paramItem),
          );
        } else {
          setExpressItem(null);
          await AsyncStorage.removeItem("@express_checkout");
        }

        const localUser = await AsyncStorage.getItem("userData");
        if (localUser) {
          const parsed = JSON.parse(localUser);
          setCurrentUser(parsed);
          const userId = parsed.id || parsed.user?.id;
          if (userId) {
            const res = await apiClient.get(`/auth/profile/${userId}`);
            setUserPoints(Number(res.data.total_points) || 0);
            if (res.data.default_address)
              setSavedAddress(res.data.default_address);
          }
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    initializeCheckout();
  }, [route.params?.expressItem]);

  const onGovernorateChange = (govId) => {
    const selectedGov = locations.find((g) => String(g.id) === String(govId));
    setAddressData({ ...addressData, governorate: govId, city: "" });
    setFilteredCities(selectedGov?.cities || []);
    setDeliveryFee(0);
  };

  const onCityChange = (cityId) => {
    const selectedCity = filteredCities.find(
      (c) => String(c.id) === String(cityId),
    );
    setAddressData({ ...addressData, city: cityId });
    if (selectedCity) {
      const gov = locations.find(
        (g) => String(g.id) === String(addressData.governorate),
      );
      setDeliveryFee(
        Number(selectedCity.custom_shipping_fee || gov?.base_shipping_fee || 0),
      );
    }
  };

  const handleUpdateQty = useCallback(
    async (id, newQty) => {
      if (newQty < 1) return;
      if (expressItem) {
        const updatedExpress = { ...expressItem, qty: newQty };
        setExpressItem(updatedExpress);
        await AsyncStorage.setItem(
          "@express_checkout",
          JSON.stringify(updatedExpress),
        );
      } else {
        updateQty(id, newQty);
      }
    },
    [expressItem, updateQty],
  );

  const handlePlaceOrder = async () => {
    if (
      !addressData.firstName ||
      !addressData.phone ||
      !addressData.city ||
      !addressData.governorate
    ) {
      setCustomAlertMessage(
        "برجاء استكمال كافة بيانات الشحن المطلوبة (الاسم، رقم الموبايل، المحافظة والمدينة) لتأكيد أوردرك.",
      );
      setCustomAlertVisible(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedGov = locations.find(
        (g) => String(g.id) === String(addressData.governorate),
      );
      const selectedCity = filteredCities.find(
        (c) => String(c.id) === String(addressData.city),
      );

      const orderPayload = {
        customer_id: currentUser?.id || currentUser?.user?.id || null,
        cart_items: itemsToRender.map((i) => {
          if (i.isBundle) {
            return {
              product_id: i.id,
              quantity: parseInt(i.qty || 1),
              is_bundle: true,
              bundle_items: i.bundleProducts.map((p) => p.product_id),
            };
          }
          return {
            product_id: parseInt(i.id),
            quantity: parseInt(i.qty || i.quantity) || 1,
            is_bundle: false,
            bundle_items: [],
          };
        }),
        points_to_redeem: isUsingPoints ? Number(userPoints) : 0,
        shipping_first_name: addressData.firstName,
        shipping_last_name: addressData.lastName || "",
        shipping_governorate:
          selectedGov?.name_ar || String(addressData.governorate),
        shipping_city: selectedCity?.name_ar || String(addressData.city),
        shipping_details: addressData.details || "No details",
        shipping_phone: addressData.phone,
        shipping_fees: Number(deliveryFee),
        payment_method: paymentMethod,
        coupon_code: null,
      };

      const res = await apiClient.post("/orders/create", orderPayload);

      if (
        res.status === 200 ||
        res.status === 201 ||
        res.data?.status === "success"
      ) {
        try {
          const purchasedItems = itemsToRender.map((item) => ({
            item_id: item.id,
            item_name: item.en_name || item.ar_name || item.title,
            price: item.final_price || item.price,
            quantity: item.qty || item.quantity || 1,
          }));

          logGTMEvent("purchase", {
            transaction_id: res.data.order_number || "GUEST-" + Date.now(),
            value: total,
            currency: "EGP",
            payment_type: paymentMethod,
            items: purchasedItems,
          });
        } catch (gtmError) {
          console.error("GTM Purchase Event Error:", gtmError);
        }

        if (!expressItem) clearCart();
        await AsyncStorage.removeItem("@express_checkout");

        navigation.navigate("SuccessScreen", {
          orderNumber: res.data.order_number,
          paymentMethod: paymentMethod,
          totalAmount: total,
          points: isUsingPoints ? 0 : Math.floor(total / 10),
        });
      }
    } catch (e) {
      console.error("Order Error Detail:", e.response?.data);
      setCustomAlertMessage(
        "عذراً، حدث خطأ أثناء إرسال الطلب. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.",
      );
      setCustomAlertVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons
              name="arrow-forward"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nabd Pharmacy</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={[
              styles.mainContainer,
              { flexDirection: isDesktop ? "row-reverse" : "column" },
            ]}
          >
            <View
              style={isDesktop ? { flex: 8, width: "100%" } : { width: "100%" }}
            >
              <Text style={styles.pageTitle}>إتمام الطلب</Text>

              <View style={styles.sectionCard}>
                <ShippingForm
                  styles={styles}
                  COLORS={COLORS}
                  addressData={addressData}
                  setAddressData={setAddressData}
                  locations={locations}
                  filteredCities={filteredCities}
                  onGovernorateChange={onGovernorateChange}
                  onCityChange={onCityChange}
                  savedAddress={savedAddress}
                  handleUseSavedAddress={() => {}}
                  isDesktop={isDesktop}
                />
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons
                    name="payments"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.sectionTitle}>وسيلة الدفع</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === "Cash" && styles.paymentOptionActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setPaymentMethod("Cash")}
                >
                  <View style={styles.paymentLeftInfo}>
                    <View
                      style={[
                        styles.radioOuter,
                        paymentMethod === "Cash" && styles.radioOuterActive,
                      ]}
                    >
                      {paymentMethod === "Cash" && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.paymentText}>
                      الدفع عند الاستلام (Cash)
                    </Text>
                  </View>
                  <MaterialIcons
                    name="local-atm"
                    size={24}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === "Wallet" && styles.paymentOptionActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setPaymentMethod("Wallet")}
                >
                  <View style={styles.paymentLeftInfo}>
                    <View
                      style={[
                        styles.radioOuter,
                        paymentMethod === "Wallet" && styles.radioOuterActive,
                      ]}
                    >
                      {paymentMethod === "Wallet" && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.paymentText}>
                      محفظة إلكترونية (فودافون كاش / انستا باي)
                    </Text>
                  </View>
                  <MaterialIcons
                    name="credit-card"
                    size={24}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={isDesktop ? { flex: 4, width: "100%" } : { width: "100%" }}
            >
              <OrderSummary
                styles={styles}
                COLORS={COLORS}
                isDesktop={isDesktop}
                itemsToRender={itemsToRender}
                handleUpdateQty={handleUpdateQty}
                currentUser={currentUser}
                userPoints={userPoints}
                isUsingPoints={isUsingPoints}
                setIsUsingPoints={setIsUsingPoints}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                pointsDiscountMoney={pointsDiscountMoney}
                total={total}
                isSubmitting={isSubmitting}
                handlePlaceOrder={handlePlaceOrder}
              />

              <View style={styles.helpBox}>
                <MaterialIcons
                  name="info"
                  size={22}
                  color={COLORS.tertiaryText}
                />
                <View style={{ marginRight: 10, flex: 1 }}>
                  <Text style={styles.helpTitle}>هل تحتاج لمساعدة؟</Text>
                  <Text style={styles.helpSub}>
                    فريقنا متاح دائماً للرد على استفساراتك الطبية عبر الواتساب
                    أو الاتصال المباشر للصيدلية.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={customAlertVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCustomAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="warning-amber" size={40} color="#d97706" />
            </View>
            <Text style={styles.modalTitle}>بيانات ناقصة ⚠️</Text>
            <Text style={styles.modalMessage}>{customAlertMsg}</Text>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setCustomAlertVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>تعديل البيانات</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
