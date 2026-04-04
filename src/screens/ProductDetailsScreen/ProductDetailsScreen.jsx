import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Platform,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { styles } from "./ProductDetailsScreen.styles";
import { productService } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import Footer from "../../components/UI/Footer/Footer";

const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params || {};
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 768; // ضفنا فحص الموبايل عشان نتحكم في حجم الصورة

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { cartItems, addToCart, removeFromCart } = useCart();
  const isInCart = product
    ? cartItems.some((item) => item.id === product.id)
    : false;

  const handleCartAction = () => {
    if (isInCart) {
      removeFromCart(product.id);
    } else {
      addToCart({ ...product, qty: quantity });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      navigation.navigate("Checkout", {
        expressItem: { ...product, qty: quantity },
      });
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const responseData = await productService.getProductById(productId);

        if (responseData) {
          setProduct(responseData);
          const allProducts = await productService.getAllProducts({
            is_active: 1,
          });
          if (allProducts && allProducts.length > 0) {
            const filteredRelated = allProducts
              .filter((p) => p.id !== productId)
              .slice(0, 5);
            setRelatedProducts(filteredRelated);
          }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    getDetails();
  }, [productId]);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#11b67f" />
      </View>
    );

  if (!product) return null;

  const images = [
    product.img_url1,
    product.img_url2,
    product.img_url3,
    product.img_url4,
  ].filter(Boolean);
  const mainImage = images[activeImg] || "https://via.placeholder.com/400";

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
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="share" size={24} color="#0f172a" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="favorite-border" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.mainWrapper}>
          <View style={[styles.gridContainer, isDesktop && styles.desktopGrid]}>
            {/* قسم الصور */}
            <View style={[styles.galleryCol, isDesktop && { flex: 7 }]}>
              <Pressable style={styles.imageBox}>
                {({ hovered }) => (
                  <View style={styles.img3DWrapper}>
                    {/* الصورة الأساسية مع تعديل الحجم للموبايل */}
                    <Image
                      source={{ uri: mainImage }}
                      style={[
                        styles.mainImg,
                        isMobile && styles.mainImgMobile, // تكبير الصورة في الموبايل
                        // تأثير الـ 3D بيشتغل بس لو مش موبايل (عشان اللمس ميعملش حركة مزعجة)
                        hovered &&
                          !isMobile && {
                            transform: [
                              { scale: 1.15 },
                              { translateY: -20 },
                              { rotateZ: "3deg" },
                            ],
                          },
                        Platform.OS === "web" && {
                          transition:
                            "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        },
                      ]}
                      resizeMode="contain"
                    />

                    {/* الظل الأرضي */}
                    <View
                      style={[
                        styles.productFloorShadow,
                        isMobile && styles.productFloorShadowMobile, // تكبير الظل في الموبايل
                        hovered &&
                          !isMobile && {
                            transform: [{ scaleX: 0.6 }],
                            opacity: 0.05,
                          },
                        Platform.OS === "web" && {
                          transition: "all 0.5s ease",
                        },
                      ]}
                    />

                    <TouchableOpacity style={styles.zoomBtn}>
                      <MaterialIcons name="360" size={24} color="#475569" />
                    </TouchableOpacity>
                  </View>
                )}
              </Pressable>

              {images.length > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.thumbScroll}
                >
                  {images.map((img, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setActiveImg(idx)}
                      style={[
                        styles.thumbItem,
                        activeImg === idx && styles.thumbItemActive,
                      ]}
                    >
                      <Image
                        source={{ uri: img }}
                        style={styles.thumbImg}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <View style={styles.trustMarkers}>
                <TrustItem
                  icon="verified-user"
                  text="موثق من قبل صيادلة مرخصين"
                />
                <TrustItem icon="thermostat" text="توصيل مبرد ومراقب حرارياً" />
                <TrustItem icon="bolt" text="توصيل سريع خلال ساعة واحدة" />
              </View>
            </View>

            {/* قسم التفاصيل */}
            <View style={[styles.detailsCol, isDesktop && { flex: 5 }]}>
              <View style={styles.detailsCard}>
                <Text style={styles.brandName}>
                  {product.Brand_Name || "جلاكسو سميث كلاين"}
                </Text>
                <Text style={styles.productTitle}>
                  {product.header || product.en_name}
                </Text>
                <Text style={styles.sku}>
                  رقم المنتج: {product.sku || "KW-99210"}
                </Text>

                <View style={styles.priceRow}>
                  <Text style={styles.finalPrice} dir="ltr">
                    {product.final_price?.toFixed(2)} EGP
                  </Text>
                  {product.price > product.final_price && (
                    <Text style={styles.oldPrice} dir="ltr">
                      {product.price?.toFixed(2)} EGP
                    </Text>
                  )}
                </View>

                <View style={styles.prescAlert}>
                  <MaterialIcons name="description" size={26} color="#38BDF8" />
                  <View style={styles.prescTextCol}>
                    <Text style={styles.prescTitle}>
                      هذا الدواء يتطلب وصفة طبية
                    </Text>
                    <Text style={styles.prescSub}>
                      يرجى رفع صورة الروشتة لإتمام الطلب
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.prescBtn}>
                    <Text style={styles.prescBtnText}>رفع</Text>
                  </TouchableOpacity>
                </View>

                {isDesktop && (
                  <View style={styles.purchaseControls}>
                    <QuantitySelector
                      quantity={quantity}
                      setQuantity={setQuantity}
                    />
                    <View style={{ flexDirection: "row", flex: 1, gap: 12 }}>
                      <TouchableOpacity
                        style={[
                          styles.addCartBtn,
                          { flex: 1 },
                          isInCart
                            ? styles.removeFromCartBtn
                            : { backgroundColor: "#f1f5f9" },
                        ]}
                        onPress={handleCartAction}
                      >
                        <MaterialIcons
                          name={
                            isInCart
                              ? "remove-shopping-cart"
                              : "add-shopping-cart"
                          }
                          size={24}
                          color={isInCart ? "#ef4444" : "#0f172a"}
                        />
                        <Text
                          style={[
                            styles.addCartText,
                            { color: isInCart ? "#ef4444" : "#0f172a" },
                          ]}
                        >
                          {isInCart ? "إزالة" : "السلة"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.addCartBtn, { flex: 2 }]}
                        onPress={handleBuyNow}
                      >
                        <MaterialIcons name="flash-on" size={24} color="#fff" />
                        <Text style={styles.addCartText}>شراء الآن</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.accordionsWrapper}>
                <Accordion
                  title="وصف المنتج"
                  content={product.description || "لا يوجد وصف إضافي متاح."}
                />
                <Accordion
                  title="المواد الفعالة"
                  content={product.header || "غير محدد"}
                />
                <Accordion
                  title="الجرعة وكيفية الاستخدام"
                  content={product.sub_header || "يرجى استشارة الطبيب المختص."}
                />
              </View>
            </View>
          </View>

          {relatedProducts.length > 0 && (
            <View style={styles.alternativesSection}>
              <View style={styles.altHeader}>
                <View style={styles.altTitleRow}>
                  <MaterialIcons name="local-offer" size={28} color="#11b67f" />
                  <Text style={styles.altTitle}>منتجات قد تهمك</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("Store")}>
                  <Text style={styles.altLink}>عرض المتجر</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.altScroll}
              >
                {relatedProducts.map((item) => (
                  <RelatedProductCard
                    key={item.id}
                    item={item}
                    onPress={() =>
                      navigation.push("ProductDetails", { productId: item.id })
                    }
                    onAddToCart={() => addToCart({ ...item, qty: 1 })}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <Footer />
      </ScrollView>

      {/* الفوتر الخاص بالموبايل */}
      {!isDesktop && (
        <View style={styles.mobileFooter}>
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          <View
            style={{ flexDirection: "row", flex: 1, marginLeft: 12, gap: 8 }}
          >
            <TouchableOpacity
              style={[
                styles.addCartBtn,
                { flex: 1, borderWidth: 1 },
                isInCart
                  ? styles.mobileRemoveFromCartBtn
                  : styles.mobileAddToCartBtn,
              ]}
              onPress={handleCartAction}
            >
              <MaterialIcons
                name={isInCart ? "remove-shopping-cart" : "add-shopping-cart"}
                size={22}
                color={isInCart ? "#ef4444" : "#11b67f"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addCartBtn, { flex: 2 }]}
              onPress={handleBuyNow}
            >
              <MaterialIcons name="flash-on" size={22} color="#fff" />
              <Text style={styles.addCartText}>شراء الآن</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

// --- Sub Components ---
const TrustItem = ({ icon, text }) => (
  <View style={styles.trustItem}>
    <View style={styles.trustIconBg}>
      <MaterialIcons name={icon} size={22} color="#11b67f" />
    </View>
    <Text style={styles.trustText}>{text}</Text>
  </View>
);

const QuantitySelector = ({ quantity, setQuantity }) => (
  <View style={styles.qtyBox}>
    <TouchableOpacity
      onPress={() => setQuantity((q) => Math.max(1, q - 1))}
      style={styles.qtyBtn}
    >
      <MaterialIcons name="remove" size={24} color="#475569" />
    </TouchableOpacity>
    <Text style={styles.qtyText}>{quantity}</Text>
    <TouchableOpacity
      onPress={() => setQuantity((q) => q + 1)}
      style={styles.qtyBtn}
    >
      <MaterialIcons name="add" size={24} color="#475569" />
    </TouchableOpacity>
  </View>
);

const Accordion = ({ title, content }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={styles.accordionHeader}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <MaterialIcons
          name={open ? "expand-less" : "expand-more"}
          size={26}
          color="#0f172a"
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.accordionBody}>
          <Text style={styles.accordionContent}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const RelatedProductCard = ({ item, onPress, onAddToCart }) => {
  const imageUri =
    item.images?.[0] ||
    item.img_url1 ||
    item.main_image ||
    "https://via.placeholder.com/150";
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.altCard}
      onPress={onPress}
    >
      <View style={styles.altImgBox}>
        <Image
          source={{ uri: imageUri }}
          style={styles.altImg}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.altName} numberOfLines={1}>
        {item.ar_name || item.en_name || item.header}
      </Text>
      <Text style={styles.altSub} numberOfLines={1}>
        {item.Brand_Name || "منتج صيدلية"}
      </Text>
      <View style={styles.altFooter}>
        <Text style={styles.altPrice}>{item.final_price?.toFixed(2)} EGP</Text>
        <TouchableOpacity
          style={styles.altCartBtn}
          onPress={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
        >
          <MaterialIcons name="add-shopping-cart" size={20} color="#11b67f" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductDetailsScreen;
