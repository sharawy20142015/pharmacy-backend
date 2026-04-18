import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
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

// 🟢 1. استيراد دالة التتبع
import { logGTMEvent } from "../../utils/analytics";

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { cartItems, clearCart } = useCart();

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

  // الحالة المسؤولة عن وسيلة الدفع (Cash أو Wallet)
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [addressData, setAddressData] = useState({
    firstName: "",
    lastName: "",
    governorate: "",
    city: "",
    details: "",
    phone: "",
  });

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
          const storedItem = await AsyncStorage.getItem("@express_checkout");
          if (storedItem) setExpressItem(JSON.parse(storedItem));
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

  const handlePlaceOrder = async () => {
    if (
      !addressData.firstName ||
      !addressData.phone ||
      !addressData.city ||
      !addressData.governorate
    ) {
      Alert.alert("بيانات ناقصة", "يرجى استكمال بيانات الشحن.");
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
        cart_items: itemsToRender.map((i) => ({
          product_id: parseInt(i.id),
          quantity: parseInt(i.qty || i.quantity) || 1,
        })),
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
        // 🟢 2. إرسال حدث الشراء لـ GTM بعد التأكد من نجاح الطلب
        try {
          const purchasedItems = itemsToRender.map((item) => ({
            item_id: item.id,
            item_name: item.en_name || item.ar_name || item.title,
            price: item.final_price || item.price,
            quantity: item.qty || item.quantity || 1,
          }));

          logGTMEvent("purchase", {
            transaction_id: res.data.order_number || "GUEST-" + Date.now(), // رقم الأوردر من الباك إند
            value: total, // الإجمالي النهائي للطلب
            currency: "EGP",
            payment_type: paymentMethod, // طريقة الدفع المحددة
            items: purchasedItems, // المنتجات اللي اشتراها
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
      Alert.alert(
        "تنبيه",
        "فشل في إتمام الطلب، يرجى مراجعة البيانات والمحاولة مرة أخرى.",
      );
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-forward"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>إتمام الطلب</Text>
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
            <View style={{ flex: 1 }}>
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
              />

              {/* قسم اختيار وسيلة الدفع */}
              <View
                style={{
                  marginTop: 20,
                  padding: 20,
                  backgroundColor: "#fff",
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: "#f1f5f9",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 20,
                    color: "#0f172a",
                  }}
                >
                  وسيلة الدفع
                </Text>

                {/* خيار الدفع كاش */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                    padding: 15,
                    borderWidth: 1.5,
                    borderRadius: 12,
                    borderColor:
                      paymentMethod === "Cash" ? COLORS.primary : "#f1f5f9",
                    backgroundColor:
                      paymentMethod === "Cash" ? "#f0fdf4" : "#fff",
                  }}
                  onPress={() => setPaymentMethod("Cash")}
                >
                  <MaterialIcons
                    name={
                      paymentMethod === "Cash"
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text
                    style={{
                      marginLeft: 12,
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#1e293b",
                    }}
                  >
                    دفع عند الاستلام (Cash)
                  </Text>
                </TouchableOpacity>

                {/* خيار المحفظة الإلكترونية */}
                <TouchableOpacity
                  style={{
                    padding: 15,
                    borderWidth: 1.5,
                    borderRadius: 12,
                    borderColor:
                      paymentMethod === "Wallet" ? COLORS.primary : "#f1f5f9",
                    backgroundColor:
                      paymentMethod === "Wallet" ? "#f0fdf4" : "#fff",
                  }}
                  onPress={() => setPaymentMethod("Wallet")}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons
                      name={
                        paymentMethod === "Wallet"
                          ? "radio-button-checked"
                          : "radio-button-unchecked"
                      }
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text
                      style={{
                        marginLeft: 12,
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#1e293b",
                      }}
                    >
                      محفظة إلكترونية (فودافون كاش / انستا باي)
                    </Text>
                  </View>
                  {paymentMethod === "Wallet" && (
                    <View
                      style={{
                        marginTop: 10,
                        padding: 12,
                        backgroundColor: "rgba(16, 183, 127, 0.1)",
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: COLORS.primary,
                          lineHeight: 20,
                          fontWeight: "500",
                        }}
                      >
                        * بعد تأكيد الأوردر، سيظهر لك رقم الهاتف للتحويل وإرسال
                        صورة الإيصال عبر واتساب.
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <OrderSummary
              styles={styles}
              COLORS={COLORS}
              isDesktop={isDesktop}
              itemsToRender={itemsToRender}
              handleUpdateQty={() => {}}
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
