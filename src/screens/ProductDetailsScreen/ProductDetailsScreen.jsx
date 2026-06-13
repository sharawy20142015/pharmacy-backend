// src/screens/ProductDetailsScreen/ProductDetailsScreen.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  Share,
  Platform, // 🟢 ضفنا الـ Platform هنا عشان نفرق بين الويب والموبايل
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";

import { styles } from "./ProductDetailsScreen.styles";
import { productService } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import Footer from "../../components/UI/Footer/Footer";
import LoadingScreen from "../../components/UI/LoadingScreen/LoadingScreen";

// استيراد المكونات المقسمة
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

  // --- States ---
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { cartItems, addToCart, removeFromCart } = useCart();
  const isInCart = product
    ? cartItems.some((item) => item.id === product.id)
    : false;

  // --- Handlers ---
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

  // 🟢 تعديل دالة الـ Share السحرية لتوليد اللينك وفتح القائمة المعروفة
  const handleShare = async () => {
    if (!product) return;
    try {
      // 1. توليد اللينك: لو ويب بياخد لينك المتصفح الحالي، لو موبايل بيبني اللينك بالدومين
      const productUrl =
        Platform.OS === "web"
          ? window.location.href
          : `https://nabdpharmacy.com/product/${productId}`; // تقدر تبدل الدومين ده بدومين موقعك لما ترفع الباك إند

      // 2. صياغة الرسالة اللي هتظهر مع اللينك
      const shareMessage = `شاهد هذا المنتج على صيدلية نبض: ${product.en_name || product.ar_name}\n\nالرابط: ${productUrl}`;

      // 3. استدعاء القائمة الأصلية للنظام (Native Share Sheet)
      await Share.share({
        message: shareMessage, // مهم جداً للأندرويد ومتصفحات الويب عشان الرابط يظهر جوه نص الرسالة
        url: productUrl, // مخصص للـ iOS عشان يظهر اللينك في خانة منفصلة أنيقة
        title: product.en_name || "Nabd Pharmacy",
      });
    } catch (error) {
      console.error("Error sharing product:", error);
    }
  };

  // --- Data Fetching ---
  useEffect(() => {
    const getDetails = async () => {
      if (!productId) return;
      try {
        setIsLoading(true);
        const productData = await productService.getProductById(productId);
        if (productData) {
          setProduct(productData);
          setIsLoading(false); // وقف التحميل للمنتج الأساسي

          // جلب المنتجات المشابهة في الخلفية
          const categorySlug = productData.categories?.[0]?.slug;
          const allProducts = await productService.getAllProducts({
            is_active: 1,
            limit: 10,
            ...(categorySlug && { category_slug: categorySlug }),
          });
          if (allProducts && allProducts.length > 0) {
            setRelatedProducts(
              allProducts.filter((p) => p.id !== productId).slice(0, 5),
            );
          }
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    getDetails();
  }, [productId]);

  if (isLoading) return <LoadingScreen />;
  if (!product) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
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
            {/* زرار المشاركة هيفضل لوحده هنا بشكل رايق */}
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
            {/* 1. مكعب معرض الصور */}
            <ProductGallery
              images={
                product.images && product.images.length > 0
                  ? product.images
                  : ["https://via.placeholder.com/400"]
              }
            />

            {/* 2. مكعب تفاصيل المنتج */}
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              handleCartAction={handleCartAction}
              handleBuyNow={handleBuyNow}
              isInCart={isInCart}
            />
          </View>

          {/* قسم المنتجات المشابهة */}
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
                          resizeMode="contain"
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

      {/* 3. مكعب فوتر الموبايل */}
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
