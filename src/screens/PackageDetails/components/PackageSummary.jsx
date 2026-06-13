// src/screens/PackageDetails/components/PackageSummary.jsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../PackageDetailsScreen.styles";

const PackageSummary = ({ totals, onAddToCart, isDesktop }) => {
  // 🟢 تحويل آمن للقيم الرقمية منعاً لأي تعارض في أنواع البيانات
  const priceBeforeDiscount = Number(totals.priceBeforeDiscount || 0);
  const discount = Number(totals.discount || 0);
  const finalTotal = Number(totals.finalTotal || 0);

  return (
    <View style={[styles.summaryCard, isDesktop && { marginTop: 54 }]}>
      <Text style={styles.summaryTitle}>ملخص الباقة</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryValue}>{totals.count} منتجات</Text>
        <Text style={styles.summaryLabel}>إجمالي العناصر المختارة</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryValue}>
          {/* 🟢 تم التصلّيح: القراءة من المتغير الآمن المحول رقمياً لمنع كراش toFixed */}
          {priceBeforeDiscount.toFixed(2)} ج.م
        </Text>
        <Text style={styles.summaryLabel}>السعر قبل الخصم</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text
          style={[styles.summaryValue, { color: "#ba1a1a", fontWeight: "700" }]}
        >
          - {discount.toFixed(2)} ج.م
        </Text>
        <Text style={styles.summaryLabel}>خصم الباقة الحصري</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryValue}>متضمنة</Text>
        <Text style={styles.summaryLabel}>ضريبة القيمة المضافة</Text>
      </View>

      <View style={styles.totalDivider} />

      <View style={styles.finalTotalRow}>
        <View style={{ alignItems: "flex-start" }}>
          <Text style={styles.finalTotalValue}>{finalTotal.toFixed(2)}</Text>
          <Text style={styles.finalTotalCurrency}>جنيه مصري</Text>
        </View>
        <Text style={styles.finalTotalLabel}>الإجمالي النهائي</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryCta}
        activeOpacity={0.9}
        onPress={onAddToCart}
        disabled={totals.count === 0}
      >
        <MaterialIcons name="shopping-basket" size={20} color="#fff" />
        <Text style={styles.primaryCtaText}>إضافة المنتجات المختارة للسلة</Text>
      </TouchableOpacity>

      <View style={styles.badgeGuarantee}>
        <MaterialIcons name="verified-user" size={22} color="#006c49" />
        <View style={{ marginRight: 10, flex: 1 }}>
          <Text style={styles.guaranteeTitle}>ضمان الجودة</Text>
          <Text style={styles.guaranteeSub}>
            جميع المنتجات أصلية 100% ومصرحة طبياً
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(PackageSummary);
