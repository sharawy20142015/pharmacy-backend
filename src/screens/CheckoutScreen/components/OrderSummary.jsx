// src/screens/CheckoutScreen/components/OrderSummary.jsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

const OrderSummary = ({
  styles,
  COLORS,
  itemsToRender,
  handleUpdateQty,
  subtotal,
  deliveryFee,
  total,
  isSubmitting,
  handlePlaceOrder,
}) => {
  return (
    <View style={styles.sectionCardOverflow}>
      {/* هيدر الملخص */}
      <View style={[styles.sectionHeader, { padding: 20, marginBottom: 0 }]}>
        <MaterialIcons name="shopping-bag" size={24} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>ملخص الطلب</Text>
      </View>

      {/* لستة المنتجات بسكرول داخلي مرن */}
      <ScrollView
        style={styles.orderListContainer}
        showsVerticalScrollIndicator={true}
      >
        {itemsToRender.map((item) => {
          const itemImage = Array.isArray(item.images)
            ? item.images[0]
            : item.image || item.images;
          const displayImage = itemImage || "https://via.placeholder.com/150";

          return (
            <View key={item.id} style={styles.summaryItemRow}>
              {/* صورة المنتج على اليمين */}
              <View style={styles.summaryItemImgBox}>
                <Image
                  source={{ uri: displayImage }}
                  style={styles.summaryItemImg}
                  contentFit="contain"
                />
              </View>

              {/* تفاصيل المنتج والعداد على اليسار */}
              <View style={styles.summaryItemInfo}>
                <Text style={styles.summaryItemName} numberOfLines={2}>
                  {item.en_name || item.ar_name || item.title}
                </Text>

                <View style={styles.summaryItemPriceQtyRow}>
                  {/* السعر الذكي */}
                  <Text style={styles.summaryItemPrice}>
                    {(
                      Number(item.final_price || item.price || 0) *
                      (item.qty || 1)
                    ).toFixed(2)}{" "}
                    ج.م
                  </Text>

                  {/* العداد الأفقي المطور */}
                  <View style={[styles.qtyBox, { flexDirection: "row" }]}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      activeOpacity={0.7}
                      onPress={() =>
                        handleUpdateQty(
                          item.id,
                          (item.qty || item.quantity || 1) - 1,
                        )
                      }
                    >
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>
                      {item.qty || item.quantity || 1}
                    </Text>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      activeOpacity={0.7}
                      onPress={() =>
                        handleUpdateQty(
                          item.id,
                          (item.qty || item.quantity || 1) + 1,
                        )
                      }
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* جدول الحساب المالي السفلي للفاتورة (مصلح وآمن تماماً) 🟢 */}
      <View style={styles.financialBreakdownBox}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>إجمالي المنتجات</Text>
          <Text style={styles.breakdownVal}>
            {Number(subtotal || 0).toFixed(2)} ج.م
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>مصاريف الشحن</Text>
          <Text
            style={[
              styles.breakdownVal,
              { color: COLORS.primary, fontWeight: "600" },
            ]}
          >
            {deliveryFee > 0
              ? `${Number(deliveryFee).toFixed(2)} ج.م`
              : "يحدد بعد اختيار المدينة"}
          </Text>
        </View>

        <View style={styles.totalDivider} />

        <View style={styles.finalTotalRow}>
          <Text style={styles.finalTotalLabel}>الإجمالي المطلوب</Text>
          <Text style={styles.finalTotalVal}>
            {Number(total || 0).toFixed(2)} ج.م
          </Text>
        </View>
      </View>

      {/* زر تأكيد الطلب الممتد المطور الـ CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.mainBtn, isSubmitting && styles.disabledBtn]}
          activeOpacity={0.9}
          disabled={isSubmitting || itemsToRender.length === 0}
          onPress={handlePlaceOrder}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <MaterialIcons
                name="shopping-cart-checkout"
                size={22}
                color="#fff"
              />
              <Text style={styles.mainBtnText}>
                تأكيد الطلب - إجمالي {Number(total || 0).toFixed(2)} ج.م
              </Text>
            </>
          )}
        </TouchableOpacity>
        <Text
          style={{
            textAlign: "center",
            color: "rgba(60, 74, 66, 0.6)",
            fontSize: 12,
            marginTop: 12,
          }}
        >
          بالضغط على تأكيد الطلب، فإنك توافق على الشروط والأحكام الخاصة بصيدلية
          نبض.
        </Text>
      </View>
    </View>
  );
};

export default React.memo(OrderSummary);
