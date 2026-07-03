import React, { useState } from "react";
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
import { useCategoriesLevel1 } from "./useCategoriesLevel1";
const ShopByCategory = () => {
  const [containerWidth, setContainerWidth] = useState(0);
  const navigation = useNavigation();

  const { data: categories = [], isLoading, isError } = useCategoriesLevel1();

  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

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

  if (isError || categories.length === 0) return null;

  return (
    <View style={styles.section}>
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
      </View>
    </View>
  );
};

export default ShopByCategory;
