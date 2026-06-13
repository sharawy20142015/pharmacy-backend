// src/screens/AllBundles/AllBundlesScreen.jsx

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";

import { styles } from "./AllBundlesScreen.styles";
import { useBundles } from "../hook/useBundles";

// مكون الكارت الداخلي
const BundleGridCard = React.memo(({ item, cardWidth }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useNavigation();

  const productsCount =
    item.products_count || (item.products || []).length || 0;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onMouseEnter={() => Platform.OS === "web" && setIsHovered(true)}
      onMouseLeave={() => Platform.OS === "web" && setIsHovered(false)}
      // 🟢 هنا التوجيه لنفس الشاشة اللي برمجناها!
      onPress={() =>
        navigation.navigate("PackageDetails", { bundleId: item.slug })
      }
      style={[
        styles.cardContainer,
        { width: cardWidth },
        isHovered && styles.cardHovered,
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.image_url || "https://via.placeholder.com/350" }}
          contentFit="cover"
          transition={300}
          style={styles.bundleImage}
        />
        <View style={[styles.categoryTag, { backgroundColor: "#d1f5e9" }]}>
          <Text style={[styles.categoryText, { color: "#006c49" }]}>
            باقة حصرية ✨
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.bundleTitle} numberOfLines={2}>
          {item.name_ar}
        </Text>

        <View style={styles.footerGrid}>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.priceLabel}>تحتوي على</Text>
            <Text style={styles.priceText}>{productsCount} منتجات متميزة</Text>
          </View>

          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>اكتشف الباقة</Text>
            <MaterialCommunityIcons
              name="chevron-left"
              size={16}
              color="#ffffff"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// الشاشة الرئيسية
const AllBundlesScreen = () => {
  const navigation = useNavigation();
  const { bundles, loading, error } = useBundles();
  const { width } = useWindowDimensions();

  // حساب عرض الكروت ديناميكياً عشان يملوا الشاشة زي الـ Grid في الويب
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  let cardWidth = "100%"; // للموبايل كارت واحد بالعرض
  if (isTablet) cardWidth = "48%"; // للتابلت كارتين جنب بعض
  if (isDesktop) cardWidth = "32%"; // للكمبيوتر 3 كروت جنب بعض

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* الهيدر */}
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <MaterialIcons name="arrow-forward" size={24} color="#006c49" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>جميع الباقات</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={true} style={styles.scrollView}>
        <View style={styles.scrollContent}>
          {/* نصوص الهيرو */}
          <Text style={styles.heroTitle}>الباقات والعروض الحصرية</Text>
          <Text style={styles.heroSub}>
            اختر مجموعتك المفضلة ووفر أكثر مع حلولنا الصحية المتكاملة المصممة
            خصيصاً لك.
          </Text>

          {/* حالات التحميل والخطأ */}
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#006c49"
              style={{ marginTop: 40 }}
            />
          ) : error || bundles.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <MaterialIcons name="search-off" size={64} color="#bbcac0" />
              <Text
                style={[styles.heroSub, { marginTop: 16, textAlign: "center" }]}
              >
                لا توجد باقات متاحة في الوقت الحالي.
              </Text>
            </View>
          ) : (
            /* شبكة الباقات */
            <View style={styles.gridContainer}>
              {bundles.map((item) => (
                <BundleGridCard
                  key={item.id}
                  item={item}
                  cardWidth={cardWidth}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllBundlesScreen;
