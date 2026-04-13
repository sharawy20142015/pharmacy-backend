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
import { styles } from "./NewArrivals.styles";
import { COLORS } from "../../../../theme/colors";
import { productService } from "../../../../services/productService";
import ProductCard from "../../../../components/UI/ProductCard/ProductCard";

const NewArrivals = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const data =
          await productService.getProductsByClassification("New Arrivals");
        setProducts(data);
      } catch (error) {
        console.error("Failed to load new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
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
          <Text style={styles.title}>New Arrivals</Text>
        </View>
        <TouchableOpacity
          onPress={() => console.log("Navigate to New Arrivals")}
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
          isDesktop && { paddingBottom: 20 },
        ]}
        renderItem={({ item }) => (
          <View
            style={{
              width: isDesktop ? 260 : 200,
              marginRight: 20,
              paddingBottom: 15,
            }}
          >
            <ProductCard
              item={item}
              isMobile={isMobile}
              onPress={() =>
                navigation.navigate("ProductDetails", { productId: item.id })
              }
              onToggleWishlist={(product) => {
                console.log("Wishlist logic here:", product.id);
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default NewArrivals;
