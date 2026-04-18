import React, { useState, memo } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { styles } from "./ProductCard.styles";
import { COLORS } from "../../../theme/colors";
import { useCart } from "../../../context/CartContext";

const THEME_GREEN = COLORS?.primary || "#10b77f";

const ProductCard = ({
  item,
  onPress,
  onToggleWishlist,
  containerStyle,
  isMobile,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // لوجيك السلة
  const { cartItems, addToCart, removeFromCart } = useCart();
  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);

  const handleCartAction = (e) => {
    e.stopPropagation();
    if (isInCart) {
      removeFromCart(item.id);
    } else {
      addToCart(item);
    }
  };

  const imageUri =
    item?.displayImage ||
    item?.images?.[0] ||
    item?.img_url1 ||
    "https://via.placeholder.com/200";

  const brandName = item?.Brand_Name || item?.vendor || "GENERIC";
  const productName = item?.en_name || item?.name || "Unknown Product";

  // 👇 لوجيك الخصم الموحد
  const oldPrice = item?.price ? Number(item.price) : 0;
  const finalPrice = item?.final_price ? Number(item.final_price) : oldPrice;
  const hasDiscount = oldPrice > finalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - finalPrice) / oldPrice) * 100)
    : 0;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.cardContainer,
        isHovered && Platform.OS === "web" && styles.cardHovered,
        containerStyle,
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.productImage,
            isHovered &&
              Platform.OS === "web" && { transform: [{ scale: 1.05 }] },
          ]}
          contentFit="contain" // 👈 بيضمن إن الصورة تفرد لأقصى حجم بدون قص
          transition={200}
          cachePolicy="memory-disk"
        />

        {/* بادچ الوصول الحديث */}
        {item?.is_new_arrival === 1 && !hasDiscount && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}

        {/* 👇 بادچ الخصم الأحمر */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>-{discountPercentage}%</Text>
          </View>
        )}

        {/* زرار الأمنيات (يظهر إذا لم يكن هناك خصم) */}
        {!hasDiscount && (
          <Pressable
            style={styles.wishlistBtn}
            onPress={(e) => {
              e.stopPropagation();
              if (onToggleWishlist) onToggleWishlist(item);
            }}
          >
            <Feather
              name="heart"
              size={14}
              color={COLORS.slate600 || "#475569"}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.brandText} numberOfLines={1}>
          {brandName}
        </Text>
        <Text style={styles.titleText} numberOfLines={2}>
          {productName}
        </Text>

        <View style={styles.priceRow}>
          {/* 👇 عمود السعر القديم والجديد */}
          <View style={styles.priceColumn}>
            {hasDiscount && (
              <Text style={styles.oldPrice}>{oldPrice.toFixed(2)} EGP</Text>
            )}
            <View style={styles.mainPriceRow}>
              <Text
                style={[styles.priceText, hasDiscount && { color: "#ef4444" }]}
              >
                {finalPrice.toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.currencyText,
                  hasDiscount && { color: "#ef4444" },
                ]}
              >
                {" "}
                EGP
              </Text>
            </View>
          </View>
        </View>

        {/* زرار الإضافة/الإزالة من السلة (عريض في الرئيسية) */}
        <TouchableOpacity
          style={[
            styles.addToCartBtn,
            isInCart && styles.removeFromCartBtn,
            isHovered &&
              !isInCart &&
              Platform.OS === "web" &&
              styles.addToCartBtnHovered,
          ]}
          onPress={handleCartAction}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name={isInCart ? "remove-shopping-cart" : "shopping-cart"}
            size={16}
            color={
              isInCart
                ? "#ef4444"
                : isHovered && Platform.OS === "web"
                  ? "#fff"
                  : THEME_GREEN
            }
          />
          <Text
            style={[
              styles.addToCartText,
              isInCart && { color: "#ef4444" },
              isHovered &&
                !isInCart &&
                Platform.OS === "web" && { color: "#fff" },
            ]}
          >
            {isInCart ? "Remove" : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default memo(ProductCard);
