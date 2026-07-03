import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./SkinCareSection.styles";
import { COLORS } from "../../../../theme/colors";
import ProductCard from "../../../../components/UI/ProductCard/ProductCard";
import { useSkinCareProducts } from "./useSkinCareProducts";

const SkinCareSection = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 768;
  const navigation = useNavigation();

  const { data: products = [], isLoading, isError } = useSkinCareProducts();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary || "#10b77f"} />
      </View>
    );
  }

  if (isError || products.length === 0) return null;

  return (
    <View style={styles.section}>
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
              width: isDesktop ? 240 : 180,
              marginRight: 15,
              paddingBottom: 10,
            }}
          >
            <ProductCard
              item={item}
              isMobile={isMobile}
              onPress={() =>
                navigation.navigate("ProductDetails", { productId: item.id })
              }
              onToggleWishlist={(product) => {
                console.log(product.id);
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default React.memo(SkinCareSection);
