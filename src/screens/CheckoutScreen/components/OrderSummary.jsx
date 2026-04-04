import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const OrderSummary = ({
  styles,
  COLORS,
  isDesktop,
  itemsToRender,
  handleUpdateQty,
  currentUser,
  userPoints,
  isUsingPoints,
  setIsUsingPoints,
  subtotal,
  deliveryFee,
  pointsDiscountMoney,
  total,
  isSubmitting,
  handlePlaceOrder,
}) => {
  // دالة لجلب الصورة
  const getImageUrl = (item) => {
    try {
      if (Array.isArray(item.images) && item.images.length > 0)
        return item.images[0];
      if (typeof item.images === "string" && item.images.startsWith("["))
        return JSON.parse(item.images)[0];
      return (
        item.img_url1 ||
        item.main_image ||
        item.images ||
        "https://via.placeholder.com/150"
      );
    } catch (e) {
      return "https://via.placeholder.com/150";
    }
  };

  return (
    <View style={[styles.rightSection, isDesktop && { width: 420 }]}>
      <View style={styles.sectionHeader}>
        <Ionicons name="receipt" size={22} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>ملخص الطلب</Text>
      </View>

      <View style={styles.card}>
        {/* 🟢 عرض المنتجات */}
        {itemsToRender.map((item, index) => {
          const price = Number(item.final_price) || Number(item.price) || 0;
          const qty = Number(item.qty) || 1;
          return (
            <View key={index} style={styles.summaryItem}>
              <View style={styles.summaryItemImgBox}>
                <Image
                  source={{ uri: getImageUrl(item) }}
                  style={styles.summaryItemImg}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.summaryItemInfo}>
                <Text style={styles.summaryItemName} numberOfLines={2}>
                  {item.ar_name || item.en_name || "منتج"}
                </Text>
                <Text style={styles.summaryItemPrice}>
                  {(price * qty).toFixed(2)} ج.م
                </Text>
                <View style={styles.qtyBox}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdateQty(item.id, qty + 1)}
                  >
                    <MaterialIcons name="add" size={18} color="#0f172a" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdateQty(item.id, qty - 1)}
                  >
                    <MaterialIcons name="remove" size={18} color="#0f172a" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        {/* 🟢 نقاط الولاء */}
        {currentUser && userPoints > 0 && (
          <View style={styles.loyaltyBox}>
            <View style={styles.loyaltyHeader}>
              <View>
                <Text style={styles.loyaltyTitle}>استبدال النقاط</Text>
                <Text style={styles.loyaltySub}>لديك {userPoints} نقطة</Text>
              </View>
              <Switch
                value={isUsingPoints}
                onValueChange={setIsUsingPoints}
                thumbColor={isUsingPoints ? COLORS.primary : "#f4f3f4"}
                trackColor={{ false: "#cbd5e1", true: "#d1fae5" }}
              />
            </View>
          </View>
        )}

        {/* 🟢 الفاتورة النهائية */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>إجمالي المنتجات</Text>
            <Text style={styles.breakdownVal}>{subtotal.toFixed(2)} ج.م</Text>
          </View>
          {isUsingPoints && (
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownLabel, { color: "#dc2626" }]}>
                خصم النقاط
              </Text>
              <Text style={[styles.breakdownVal, { color: "#dc2626" }]}>
                - {pointsDiscountMoney.toFixed(2)} ج.م
              </Text>
            </View>
          )}
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>مصاريف الشحن</Text>
            <Text style={[styles.breakdownVal, { color: COLORS.primary }]}>
              {deliveryFee > 0
                ? `+ ${deliveryFee.toFixed(2)} ج.م`
                : "يحدد بعد اختيار المدينة"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>الإجمالي المطلوب</Text>
            <Text style={styles.totalVal}>{total.toFixed(2)} ج.م</Text>
          </View>

          <TouchableOpacity
            style={[styles.mainBtn, isSubmitting && styles.disabledBtn]}
            onPress={handlePlaceOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialIcons
                  name="shopping-cart-checkout"
                  size={24}
                  color="#fff"
                />
                <Text style={styles.mainBtnText}>تأكيد وطلب الآن</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OrderSummary;
