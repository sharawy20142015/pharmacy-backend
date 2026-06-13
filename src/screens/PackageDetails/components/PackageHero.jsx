// src/screens/PackageDetails/components/PackageHero.jsx

import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../PackageDetailsScreen.styles";

const PackageHero = ({ data }) => {
  // 🟢 معالجة وفك مسميات الداتا الحية القادمة من السيرفر
  const title = data.name_ar || data.title;
  const rating = data.rating || "4.9";
  const reviewsCount = data.reviewsCount || 120;

  return (
    <View style={styles.heroCard}>
      {/* 🟢 شيلنا حاوية الصورة بالكامل بناءً على طلبك عشان التصميم يبقى هادي ومرتب ونصي فقط */}
      <View style={{ padding: 24, alignItems: "flex-end", flex: 1 }}>
        <View style={styles.exclusiveBadge}>
          <Text style={styles.exclusiveBadgeText}>باقة حصرية</Text>
        </View>

        {/* عنوان الباقة من سوبابيز */}
        <Text style={styles.heroTitle}>{title}</Text>

        {/* وصف الباقة بالتفصيل */}
        <Text style={styles.heroDesc}>{data.description}</Text>

        {/* شريط الإحصائيات (عدد المنتجات والتقييم) */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialIcons name="inventory" size={16} color="#006c49" />
            <Text style={styles.metaText}>
              {(data.products || []).length} منتجات
            </Text>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaItem}>
            <MaterialIcons name="star" size={16} color="#ffb300" />
            <Text style={styles.metaText}>
              {rating} ({reviewsCount} تقييم)
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(PackageHero);
