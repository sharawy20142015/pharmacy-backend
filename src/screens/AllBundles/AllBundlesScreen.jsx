import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { Pressable } from "react-native";

import { styles } from "./AllBundlesScreen.styles";
import { useBundles } from "../hook/useBundles";

const BundleGridCard = React.memo(({ item, cardWidth }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useNavigation();

  const productsCount =
    item.products_count || (item.products || []).length || 0;

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
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
    </Pressable>
  );
});

const AllBundlesScreen = () => {
  const navigation = useNavigation();
  const { bundles, loading, error } = useBundles();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  let cardWidth = "100%";
  if (isTablet) cardWidth = "48%";
  if (isDesktop) cardWidth = "32%";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-forward" size={24} color="#006c49" />
          </Pressable>
          <Text style={styles.headerTitle}>جميع الباقات</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={true} style={styles.scrollView}>
        <View style={styles.scrollContent}>
          <Text style={styles.heroTitle}>الباقات والعروض الحصرية</Text>
          <Text style={styles.heroSub}>
            اختر مجموعتك المفضلة ووفر أكثر مع حلولنا الصحية المتكاملة المصممة
            خصيصاً لك.
          </Text>

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
