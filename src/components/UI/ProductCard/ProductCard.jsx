import React, { useState } from "react";
import { View, Text, Image, Pressable, Platform } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { styles } from "./ProductCard.styles";
import { COLORS } from "../../../theme/colors";
import { useCart } from "../../../context/CartContext"; // استدعاء السلة

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
    e.stopPropagation(); // منع الانتقال لصفحة التفاصيل
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
  const price = item?.final_price || item?.price || "0.00";

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
          resizeMode="contain"
        />

        {item?.is_new_arrival === 1 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}

        <Pressable
          style={styles.wishlistBtn}
          onPress={(e) => {
            e.stopPropagation();
            if (onToggleWishlist) onToggleWishlist(item);
          }}
        >
          <Feather
            name="heart"
            size={18}
            color={COLORS.slate600 || "#475569"}
          />
        </Pressable>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.brandText} numberOfLines={1}>
          {brandName}
        </Text>
        <Text style={styles.titleText} numberOfLines={2}>
          {productName}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{price}</Text>
          <Text style={styles.currencyText}>EGP</Text>
        </View>

        {/* زرار الإضافة/الإزالة من السلة */}
        <Pressable
          style={({ pressed }) => [
            styles.addToCartBtn,
            isInCart && styles.removeFromCartBtn, // ستايل لو المنتج في السلة
            pressed && { opacity: 0.8 },
            isHovered &&
              !isInCart &&
              Platform.OS === "web" &&
              styles.addToCartBtnHovered,
          ]}
          onPress={handleCartAction}
        >
          <MaterialIcons
            name={isInCart ? "remove-shopping-cart" : "shopping-cart"}
            size={18}
            color={
              isInCart
                ? "#ef4444"
                : isHovered && Platform.OS === "web"
                  ? "#fff"
                  : COLORS.primary || "#10b77f"
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
        </Pressable>
      </View>
    </Pressable>
  );
};

export default ProductCard;
