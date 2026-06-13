// src/screens/PackageDetails/components/PackageProductItem.jsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../PackageDetailsScreen.styles";

const PackageProductItem = ({ product, isSelected, onToggle }) => {
  // 🟢 قراءة رابط الصورة الحقيقي الآتي من كرت كلاوديناري في سوبابيز، ولو مش موجود بيحط صورة طبية احتياطية
  const productImage =
    product.image ||
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[styles.productCard, !isSelected && styles.productCardUnselected]}
    >
      {/* الـ Checkbox التفاعلي الأنيق */}
      <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
        {isSelected && <MaterialIcons name="check" size={16} color="#fff" />}
      </View>

      {/* تفاصيل النص والسعر */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.productDesc} numberOfLines={1}>
          {product.desc}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>
            {Number(product.price || 0).toFixed(2)} ج.م
          </Text>
          {product.oldPrice && (
            <Text style={styles.productOldPrice}>
              {Number(product.oldPrice || 0).toFixed(2)} ج.م
            </Text>
          )}
        </View>
      </View>

      {/* صورة المنتج المصغرة الحقيقية من سوبابيز 🚀 */}
      <View style={styles.productThumbWrapper}>
        <Image
          source={{ uri: productImage }}
          style={styles.productThumb}
          contentFit="cover"
          transition={250} // تأثير أنيق أثناء تحميل الصورة
        />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(PackageProductItem);
