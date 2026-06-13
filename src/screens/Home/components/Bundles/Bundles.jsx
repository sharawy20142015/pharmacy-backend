// src/screens/Home/components/Bundles/Bundles.jsx

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import styles from "./Bundles.styles";
import { useBundles } from "../../../hook/useBundles";

// --- 1. مكون كارت الباقة المنفرد (BundleCard) ---
const BundleCard = React.memo(({ item }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const navigation = useNavigation();

  // تحديد عرض الكارت ديناميكياً حسب حجم شاشة الويب أو الموبايل
  const cardWidth = windowWidth > 768 ? 380 : 310;

  const handleHoverIn = () => {
    if (Platform.OS === "web") setIsHovered(true);
  };

  const handleHoverOut = () => {
    if (Platform.OS === "web") setIsHovered(false);
  };

  // حسبة ديناميكية سريعة لعدد المنتجات المتوفرة جوة الباقة
  const productsCount =
    item.products_count || (item.products || []).length || 0;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
      // التوجيه لشاشة تفاصيل الباقة وتمرير الـ slug الخاص بها
      onPress={() =>
        navigation.navigate("PackageDetails", { bundleId: item.slug })
      }
      style={[
        styles.cardContainer,
        { width: cardWidth },
        isHovered && styles.cardHovered,
      ]}
    >
      {/* حاوية الصورة النظيفة */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.image_url || "https://via.placeholder.com/350" }}
          contentFit="cover"
          transition={300}
          style={styles.bundleImage}
        />
      </View>

      {/* تفاصيل الكارت السفلي */}
      <View style={styles.cardContent}>
        {/* اسم الباقة العربي المنسق */}
        <Text style={styles.bundleTitle} numberOfLines={1}>
          {item.name_ar}
        </Text>

        <View style={styles.footerGrid}>
          {/* عداد محتويات الباقة بدلاً من الأسعار المربكة */}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.priceLabel}>تحتوي على</Text>
            <Text style={styles.priceText}>{productsCount} منتجات متميزة</Text>
          </View>

          {/* زر الاستكشاف */}
          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>اكتشف الباقة</Text>
            <MaterialCommunityIcons
              name="chevron-left"
              size={18}
              color="#ffffff"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// --- 2. المكون الأساسي للسكشن بالكامل (Bundles) ---
const Bundles = () => {
  const navigation = useNavigation();
  // استدعاء الـ Hook وسحب الداتا الحية من سوبابيز
  const { bundles, loading, error } = useBundles();

  // حالة التحميل الراقية
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingVertical: 40,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color="#006c49" />
      </View>
    );
  }

  // إخفاء السكشن تماماً في حالة الخطأ أو عدم وجود بيانات لجمالية التطبيق
  if (error || bundles.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* هيدر السكشن الإرشادي */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <View style={styles.indicator} />
          <Text style={styles.sectionTitle}>Shop By Bundle</Text>
        </View>

        {/* زر عرض الكل التفاعلي المربوط بـ شاشتك الجديدة الحريقة 🟢 */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate("AllBundles")}
        >
          <Text style={styles.seeAllText}>عرض الكل</Text>
        </TouchableOpacity>
      </View>

      {/* قائمة الباقات الأفقية المرنة */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        inverted={Platform.OS !== "web"} // الحفاظ على اتجاه السكرول العربي الصحيح للموبايل
      >
        {bundles.map((item) => (
          <BundleCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default React.memo(Bundles);
