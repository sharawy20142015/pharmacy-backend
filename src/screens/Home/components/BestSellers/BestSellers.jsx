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
import { styles } from "./BestSellers.styles";
import { COLORS } from "../../../../theme/colors";
import { productService } from "../../../../services/productService";
// استدعاء الكارت الاحترافي الموحد
import ProductCard from "../../../../components/UI/ProductCard/ProductCard";

const BestSellers = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 768; // تمريرها للكارت لضبط المسافات

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const data =
          await productService.getProductsByClassification("Best Sellers");
        setProducts(data);
      } catch (error) {
        console.error("Failed to load best sellers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
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
        <ActivityIndicator size="large" color={COLORS.primary || "#10b77f"} />
      </View>
    );
  }

  if (products.length === 0) return null;

  return (
    <View style={styles.section}>
      {/* الهيدر الاحترافي */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.indicator} />
          <Text style={styles.title}>Best Sellers</Text>
        </View>
        <TouchableOpacity
          onPress={() => console.log("Navigate to Best Sellers")}
        >
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* التمرير الأفقي وعرض المنتجات بالكارت الجديد */}
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
              width: isDesktop ? 260 : 200, // عرض متناسق للكروت
              marginRight: 20,
              paddingBottom: 15, // عشان ظل الكارت يظهر براحته
            }}
          >
            <ProductCard
              item={item}
              isMobile={isMobile}
              onPress={() =>
                navigation.navigate("ProductDetails", { productId: item.id })
              }
              onToggleWishlist={(product) => {
                console.log("Toggle Wishlist for:", product.id);
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BestSellers;
