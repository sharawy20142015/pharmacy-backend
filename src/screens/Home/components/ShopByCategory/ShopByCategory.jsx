import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./ShopByCategory.styles";
import { COLORS } from "../../../../theme/colors";
import apiClient from "../../../../services/apiClient";

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 🟢 التعديل هنا: بننادي على الـ API الجديد الخاص بـ Level 1
        const response = await apiClient.get("/categories/level-1");

        // فلترة الأقسام عشان نعرض بس اللي ليهم صور
        const filteredCategories = response.data.filter(
          (cat) => cat.img_url && cat.img_url.trim() !== "",
        );

        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  // دالة حساب عرض الكارت بناءً على عرض الشاشة (Grid Logic)
  const getCardStyle = () => {
    if (containerWidth === 0) return { width: "48%" };
    const gap = 16;
    let columns = 2;
    if (containerWidth >= 1200) columns = 6;
    else if (containerWidth >= 900) columns = 4;
    else if (containerWidth >= 600) columns = 3;

    const totalGapSpace = gap * (columns - 1);
    const cardWidth = (containerWidth - totalGapSpace) / columns - 0.5;
    return { width: cardWidth };
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  // لو مفيش أقسام رجعت (بسبب إن الأقسام اللي ليها صور مفهاش منتجات)، مش هنعرض السكشن
  if (categories.length === 0) return null;

  return (
    <View style={styles.section}>
      {/* Header Section */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <View style={styles.indicator} />
          <Text style={styles.title}>Shop By Category</Text>
        </View>
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => navigation.navigate("Store")}
        >
          <Text style={styles.viewAllText}>See All</Text>
          <MaterialIcons
            name="chevron-right"
            size={18}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Grid Container */}
      <View style={styles.gridContainer} onLayout={handleLayout}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.card, getCardStyle()]}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate("Store", {
                screen: "StoreMain",
                params: {
                  categorySlug: cat.slug,
                  categoryName: cat.name,
                },
              });
            }}
          >
            <Image
              source={{ uri: cat.img_url }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.85)"]}
              style={styles.gradientOverlay}
            >
              <Text style={styles.cardTitle}>{cat.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        {/* View All Card */}
        {/* <TouchableOpacity
          style={[styles.viewAllCard, getCardStyle()]}
          activeOpacity={0.6}
          onPress={() => navigation.navigate("Store")}
        >
          <MaterialIcons name="grid-view" size={36} color={COLORS.primary} />
          <Text style={styles.viewAllCardText}>All Categories</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ShopByCategory;
