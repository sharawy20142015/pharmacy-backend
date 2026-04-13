import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  FlatList, // 👇 1. استيراد FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./Cosmetics.styles";
import { COLORS } from "../../../../theme/colors";
import { productService } from "../../../../services/productService";
// استيراد الـ ProductCard الجديد
import ProductCard from "../../../../components/UI/ProductCard/ProductCard";

const Cosmetics = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCosmetics = async () => {
      try {
        const data =
          await productService.getProductsByClassification("Cosmetics");
        setProducts(data);
      } catch (error) {
        console.error("Failed to load cosmetics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCosmetics();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          paddingVertical: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (products.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.indicator} />
          <Text style={styles.title}>Cosmetics & Beauty</Text>
        </View>
        <TouchableOpacity
          onPress={() => console.log("Navigate to Cosmetics Category")}
        >
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* 👇 2. استخدام FlatList بدلاً من ScrollView */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.scrollContainer,
          // تظبيط العرض في الشاشات الكبيرة
          isDesktop && { paddingBottom: 20 },
        ]}
        renderItem={({ item }) => (
          <View
            style={{
              // تظبيط عرض الكارت عشان يكون متناسق
              width: isDesktop ? 260 : 200,
              marginRight: 20,
              paddingBottom: 15, // عشان الـ shadow بتاع الـ ProductCard يظهر
            }}
          >
            <ProductCard
              item={item}
              isMobile={isMobile}
              onPress={() =>
                navigation.navigate("ProductDetails", { productId: item.id })
              }
              onToggleWishlist={(product) => {
                console.log("Toggle Wishlist:", product.id);
                // هنا هتحط لوجيك الويش ليست لو عندك
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Cosmetics;
