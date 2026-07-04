import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  Share,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query"; // 👈 استيراد React Query

import { styles } from "./ProductDetailsScreen.styles";
import { productService } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import Footer from "../../components/UI/Footer/Footer";
import LoadingScreen from "../../components/UI/LoadingScreen/LoadingScreen";

import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import MobileFooter from "./components/MobileFooter";

const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params || {};

  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  const [quantity, setQuantity] = useState(1);
  const { cartItems, addToCart, removeFromCart } = useCart();

  // 1️⃣ جلب تفاصيل المنتج الأساسي
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId, // متشتغلش إلا لو الـ ID موجود
  });

  // استخراج قسم المنتج عشان نستخدمه في الطلب التاني
  const categorySlug = product?.categories?.[0]?.slug;

  // 2️⃣ جلب المنتجات المشابهة (هتشتغل أوتوماتيك لما الـ categorySlug يتوفر)
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["relatedProducts", categorySlug],
    queryFn: async () => {
      const allProducts = await productService.getAllProducts({
        is_active: 1,
        limit: 10,
        ...(categorySlug && { category_slug: categorySlug }),
      });
      return allProducts.filter((p) => p.id !== productId).slice(0, 5);
    },
    enabled: !!categorySlug, // 👈 مش هيشتغل إلا لما المنتج الأساسي ييجي ونعرف قسمه
  });

  const isInCart = product
    ? cartItems.some((item) => item.id === product?.id)
    : false;

  const handleCartAction = () =>
    isInCart
      ? removeFromCart(product.id)
      : addToCart({ ...product, qty: quantity });

  const handleBuyNow = () => {
    if (product)
      navigation.navigate("Checkout", {
        expressItem: { ...product, qty: quantity },
      });
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      const productUrl =
        Platform.OS === "web"
          ? window.location.href
          : `https://nabdpharmacy.com/product/${productId}`;

      const shareMessage = `شاهد هذا المنتج على صيدلية نبض: ${
        product.en_name || product.ar_name
      }\n\nالرابط: ${productUrl}`;

      await Share.share({
        message: shareMessage,
        url: productUrl,
        title: product.en_name || "Nabd Pharmacy",
      });
    } catch (error) {}
  };

  // لو المنتج الأساسي بيحمل، اعرض شاشة التحميل
  if (isProductLoading) return <LoadingScreen />;
  if (!product) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}
          >
            <MaterialIcons
              name="arrow-forward"
              size={26}
              color="#0f172a"
              style={styles.rtlIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {product.en_name}
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
              <MaterialIcons name="share" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          !isDesktop && { paddingBottom: 140 },
        ]}
      >
        <View style={styles.mainWrapper}>
          <View style={[styles.gridContainer, isDesktop && styles.desktopGrid]}>
            <ProductGallery
              images={
                product.images && product.images.length > 0
                  ? product.images
                  : ["https://via.placeholder.com/400"]
              }
            />

            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              handleCartAction={handleCartAction}
              handleBuyNow={handleBuyNow}
              isInCart={isInCart}
            />
          </View>

          {relatedProducts.length > 0 && (
            <View style={styles.alternativesSection}>
              <View style={styles.altHeader}>
                <View style={styles.altTitleRow}>
                  <MaterialIcons name="local-offer" size={28} color="#11b67f" />
                  <Text style={styles.altTitle}>منتجات قد تهمك</Text>
                </View>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.altScroll}
              >
                {relatedProducts.map((item) => {
                  const imageUri =
                    item.images?.[0] ||
                    item.img_url1 ||
                    "https://via.placeholder.com/150";
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.9}
                      style={styles.altCard}
                      onPress={() =>
                        navigation.push("ProductDetails", {
                          productId: item.id,
                        })
                      }
                    >
                      <View style={styles.altImgBox}>
                        <Image
                          source={{ uri: imageUri }}
                          style={styles.altImg}
                          contentFit="contain"
                          transition={200}
                        />
                      </View>
                      <Text style={styles.altName} numberOfLines={1}>
                        {item.ar_name || item.en_name}
                      </Text>
                      <Text style={styles.altSub} numberOfLines={1}>
                        {item.Brand_Name || "منتج صيدلية"}
                      </Text>
                      <View style={styles.altFooter}>
                        <Text style={styles.altPrice}>
                          {item.final_price?.toFixed(2)} EGP
                        </Text>
                        <TouchableOpacity
                          style={styles.altCartBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            addToCart({ ...item, qty: 1 });
                          }}
                        >
                          <MaterialIcons
                            name="add-shopping-cart"
                            size={20}
                            color="#11b67f"
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
        <Footer />
      </ScrollView>

      {!isDesktop && (
        <MobileFooter
          handleBuyNow={handleBuyNow}
          handleCartAction={handleCartAction}
          isInCart={isInCart}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      )}
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;
