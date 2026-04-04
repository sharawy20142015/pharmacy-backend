// E:\Sharawy\PharmacyApp\frontend\src\screens\Home\components\SkinCareSection\SkinCareSection.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./SkinCareSection.styles";
import { COLORS } from "../../../../theme/colors";
import { productService } from "../../../../services/productService";
import ProductCard from "../../../../components/UI/ProductCard/ProductCard";

const SkinCareSection = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSkinCareProducts = async () => {
      try {
        // تأكد إن الـ slug "skin-care" هو اللي متسجل عندك في قاعدة البيانات
        const data =
          await productService.getProductsByCategorySlug("skin-care");
        setProducts(data);
      } catch (error) {
        console.error("Failed to load Skin Care products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkinCareProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary || "#10b77f"} />
      </View>
    );
  }

  // لو مفيش منتجات في القسم ده، مش هنعرض السيكشن خالص عشان شكل الصفحة
  if (products.length === 0) return null;

  return (
    <View style={styles.section}>
      {/* هيدر قسم العناية بالبشرة */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.indicator} />
          <Text style={styles.title}>Skin Care</Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Store", {
              screen: "StoreMain",
              params: { categorySlug: "skin-care", categoryName: "Skin Care" },
            })
          }
          activeOpacity={0.7}
        >
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* سكرول المنتجات الأفقي */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          isDesktop && { paddingBottom: 20 },
        ]}
      >
        {products.map((item) => (
          <View
            key={item.id}
            style={{
              // العرض متناسق مع اللي في الصورة
              width: isDesktop ? 240 : 180,
              marginRight: 15,
              paddingBottom: 10, // مساحة للظل (Shadow)
            }}
          >
            <ProductCard
              item={item}
              isMobile={isMobile}
              onPress={() =>
                navigation.navigate("ProductDetails", { productId: item.id })
              }
              onToggleWishlist={(product) => {
                console.log("Wishlist logic:", product.id);
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default SkinCareSection;
