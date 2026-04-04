import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../theme/colors";

const OrderCard = ({ order, onPress, statusConfig }) => {
  const config = statusConfig[order.status] || statusConfig.pending;

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  return (
    // 🟢 حولنا دي لـ View عادي عشان نمنع تداخل الضغطات في الويب
    <View style={styles.card}>
      {/* رأس الكارت */}
      <View style={styles.cardHeader}>
        <View style={styles.orderNumberContainer}>
          <MaterialCommunityIcons
            name="receipt-text"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.orderNumber}>{order.order_number}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
          <Feather
            name={config.icon}
            size={12}
            color={config.color}
            style={{ marginLeft: 6 }}
          />
          <Text style={[styles.statusText, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
      </View>

      {/* بيانات الكارت */}
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Feather name="user" size={16} color={COLORS.secondary} />
          </View>
          <Text style={styles.infoText}>{order.customer_name}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Feather name="calendar" size={16} color={COLORS.secondary} />
          </View>
          <Text style={styles.infoText}>{formatDate(order.date)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* نهاية الكارت */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.footerLabel}>إجمالي الطلب</Text>
          <Text style={styles.orderTotal}>{order.total_final_amount} ج.م</Text>
        </View>

        {/* 🟢 الزرار ده بس هو اللي قابل للضغط دلوقتي */}
        <TouchableOpacity
          style={styles.detailsBtn}
          activeOpacity={0.7}
          onPress={onPress}
        >
          <Text style={styles.detailsBtnText}>عرض التفاصيل</Text>
          <Feather name="chevron-left" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    elevation: 3,
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  orderNumberContainer: { flexDirection: "row", alignItems: "center" },
  orderNumber: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.slate900,
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: "bold" },
  cardBody: { gap: 12, marginBottom: 20 },
  infoRow: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  infoText: { fontSize: 15, color: COLORS.slate700, fontWeight: "500" },
  divider: {
    height: 1,
    backgroundColor: COLORS.slate200,
    marginBottom: 15,
    opacity: 0.5,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: { fontSize: 12, color: COLORS.slate500, marginBottom: 4 },
  orderTotal: { fontSize: 20, fontWeight: "900", color: COLORS.primary },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },
  detailsBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginLeft: 5,
  },
});

export default OrderCard;
