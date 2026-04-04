import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { COLORS } from "../../../../theme/colors";

const OrderDetailModal = ({
  visible,
  onClose,
  order,
  onUpdateStatus,
  statusConfig,
}) => {
  if (!order || !visible) return null;

  const orderStatusKey = order.status ? order.status.toLowerCase() : "pending";
  const currentConfig = statusConfig[orderStatusKey] || statusConfig.pending;

  const handleCall = (phone) => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  // 🟢 تحديد شكل وأيقونة طريقة الدفع
  const isWallet = order.payment_method?.toLowerCase() === "wallet";

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* --- Header --- */}
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="receipt-text"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.modalTitle}>تفاصيل الفاتورة</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Feather name="x" size={24} color={COLORS.slate900} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 🟢 --- 0. طريقة الدفع (إضافة جديدة) --- 🟢 */}
            <View
              style={[
                styles.paymentBadgeContainer,
                { backgroundColor: isWallet ? "#e0f2fe" : "#f1f5f9" },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <FontAwesome5
                  name={isWallet ? "mobile-alt" : "money-bill-wave"}
                  size={16}
                  color={isWallet ? COLORS.secondary : COLORS.slate700}
                />
                <Text
                  style={[
                    styles.paymentLabel,
                    { color: isWallet ? COLORS.secondary : COLORS.slate700 },
                  ]}
                >
                  طريقة الدفع:
                </Text>
                <Text
                  style={[
                    styles.paymentValue,
                    { color: isWallet ? COLORS.secondary : COLORS.slate700 },
                  ]}
                >
                  {isWallet
                    ? "محفظة إلكترونية (فودافون كاش / انستا باي)"
                    : "دفع عند الاستلام (Cash)"}
                </Text>
              </View>
              {isWallet && (
                <View style={styles.walletAlert}>
                  <Text style={styles.walletAlertText}>
                    ⚠️ تأكد من استلام صورة التحويل قبل تغيير الحالة لـ
                    Processing
                  </Text>
                </View>
              )}
            </View>

            {/* --- 1. بيانات التواصل --- */}
            <Text style={styles.sectionTitle}>بيانات العميل والتوصيل:</Text>
            <View style={styles.sectionContainer}>
              <View style={styles.infoRow}>
                <Feather name="user" size={16} color={COLORS.primary} />
                <Text style={styles.contactText}>{order.customer_name}</Text>
              </View>

              <TouchableOpacity
                style={styles.infoRow}
                onPress={() => handleCall(order.customer_phone)}
                activeOpacity={0.7}
              >
                <Feather name="phone" size={16} color={COLORS.secondary} />
                <Text
                  style={[
                    styles.contactText,
                    { color: COLORS.primary, textDecorationLine: "underline" },
                  ]}
                >
                  {order.customer_phone || "غير مسجل"}
                </Text>
              </TouchableOpacity>

              <View style={styles.infoRow}>
                <Feather name="map-pin" size={16} color={COLORS.red500} />
                <Text style={styles.contactText}>
                  {order.shipping_address || "لا يوجد عنوان مسجل"}
                </Text>
              </View>
            </View>

            {/* --- 2. تفاصيل المنتجات --- */}
            <Text style={styles.sectionTitle}>المنتجات المطلوب:</Text>
            <View style={styles.sectionContainer}>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <View key={index}>
                    <View style={styles.itemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemName}>{item.product_name}</Text>
                        <Text style={styles.itemQty}>
                          الكمية: {item.quantity}
                        </Text>
                      </View>
                      <Text style={styles.itemPrice}>{item.subtotal} ج.م</Text>
                    </View>
                    {index !== order.items.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.contactText}>لا توجد تفاصيل للمنتجات</Text>
              )}
            </View>

            {/* --- 3. ملخص الحساب --- */}
            <View
              style={[
                styles.sectionContainer,
                { backgroundColor: COLORS.white },
              ]}
            >
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>رسوم الشحن:</Text>
                <Text style={styles.summaryValue}>
                  + {order.shipping_fees || 0} ج.م
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>الإجمالي النهائي:</Text>
                <Text style={styles.totalValue}>
                  {order.total_final_amount} ج.م
                </Text>
              </View>
            </View>

            {/* --- 4. تحديث حالة الطلب --- */}
            <Text style={styles.sectionTitle}>تغيير حالة الطلب:</Text>
            <View style={styles.statusButtonsContainer}>
              {Object.keys(statusConfig).map((key) => {
                if (key === "all") return null;
                const config = statusConfig[key];
                const isSelected =
                  order.status?.toLowerCase() === key.toLowerCase();
                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.7}
                    style={[
                      styles.statusBtn,
                      isSelected && {
                        backgroundColor: config.color,
                        borderColor: config.color,
                      },
                    ]}
                    onPress={() => onUpdateStatus(order.id, key)}
                  >
                    <Feather
                      name={config.icon}
                      size={16}
                      color={isSelected ? COLORS.white : config.color}
                      style={{ marginLeft: 6 }}
                    />
                    <Text
                      style={[
                        styles.statusBtnText,
                        { color: isSelected ? COLORS.white : COLORS.slate700 },
                      ]}
                    >
                      {config.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 25,
    width: Platform.OS === "web" ? 550 : "95%",
    maxHeight: "90%",
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: COLORS.slate900,
  },
  closeBtn: {
    backgroundColor: COLORS.backgroundLight,
    padding: 8,
    borderRadius: 50,
  },

  // 🟢 استايلات حقل الدفع الجديد
  paymentBadgeContainer: {
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  paymentLabel: { fontSize: 14, fontWeight: "700" },
  paymentValue: { fontSize: 14, fontWeight: "bold" },
  walletAlert: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  walletAlertText: {
    fontSize: 12,
    color: "#0369a1",
    fontWeight: "bold",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: COLORS.slate900,
  },
  sectionContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  contactText: {
    fontSize: 15,
    color: COLORS.slate700,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "left",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.slate900,
    textAlign: "left",
  },
  itemQty: { fontSize: 13, color: COLORS.slate500, textAlign: "left" },
  itemPrice: { fontSize: 16, fontWeight: "bold", color: COLORS.slate900 },
  divider: { height: 1, backgroundColor: COLORS.slate200, marginVertical: 10 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { fontSize: 14, color: COLORS.slate500, fontWeight: "600" },
  summaryValue: { fontSize: 14, color: COLORS.slate900, fontWeight: "700" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 15,
    borderColor: COLORS.slate200,
  },
  totalLabel: { fontSize: 17, fontWeight: "bold", color: COLORS.slate900 },
  totalValue: { fontSize: 22, fontWeight: "900", color: COLORS.primary },
  statusButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 10,
  },
  statusBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  statusBtnText: { fontSize: 13, fontWeight: "bold" },
});

export default OrderDetailModal;
