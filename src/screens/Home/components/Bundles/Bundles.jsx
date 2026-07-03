import React, { useState, useCallback } from "react";
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
import { useBundles } from "./useBundles";

const BundleCard = React.memo(({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const navigation = useNavigation();

  const cardWidth = windowWidth > 768 ? 380 : 310;

  const handleHoverIn = useCallback(() => {
    if (Platform.OS === "web") setIsHovered(true);
  }, []);

  const handleHoverOut = useCallback(() => {
    if (Platform.OS === "web") setIsHovered(false);
  }, []);

  const productsCount =
    item.products_count || (item.products || []).length || 0;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
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
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.bundleTitle} numberOfLines={1}>
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
              size={18}
              color="#ffffff"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const Bundles = () => {
  const navigation = useNavigation();
  const { data: bundles = [], isLoading, isError } = useBundles();

  if (isLoading) {
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

  const validBundles = Array.isArray(bundles) ? bundles : [];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <View style={styles.indicator} />
          <Text style={styles.sectionTitle}>Shop By Bundle</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate("AllBundles")}
        >
          <Text style={styles.seeAllText}>عرض الكل</Text>
        </TouchableOpacity>
      </View>

      {isError ? (
        <Text style={{ padding: 20, color: "red", textAlign: "center" }}>
          حدث خطأ في تحميل الباقات
        </Text>
      ) : validBundles.length === 0 ? (
        <Text style={{ padding: 20, textAlign: "center", color: "#666" }}>
          لا توجد باقات متاحة حالياً
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          inverted={Platform.OS !== "web"}
        >
          {validBundles.map((item) => (
            <BundleCard key={item.id} item={item} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default React.memo(Bundles);
