import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../ProductDetailsScreen.styles";
import { QuantitySelector, Accordion, TrustMarkersList } from "./SharedUI";

const ProductInfo = ({
  product,
  quantity,
  setQuantity,
  handleCartAction,
  handleBuyNow,
  isInCart,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  return (
    <View style={[styles.detailsCol, isDesktop && { flex: 5 }]}>
      <View style={styles.detailsCard}>
        <Text style={styles.brandName}>
          {product.Brand_Name || "منتج صيدلية"}
        </Text>

        <Text
          style={[styles.productTitle, isMobile && styles.productTitleMobile]}
        >
          {/* بنعرض الاسم العربي لو موجود، لو لأ نعرض الإنجليزي */}
          {product.header || product.en_name || product.ar_name}
        </Text>

        {/* 👈 التعديل هنا: ضفنا مكان الـ sub_header تحت العنوان مباشرة */}
        {product.sub_header ? (
          <Text
            style={{
              fontSize: 14,
              color: "#64748b", // لون رمادي شيك
              marginTop: 4,
              textAlign: "right",
              lineHeight: 20,
            }}
          >
            {product.sub_header}
          </Text>
        ) : null}

        <Text style={styles.sku}>رقم المنتج: {product.sku}</Text>

        <View style={styles.priceRow}>
          <Text
            style={[styles.finalPrice, isMobile && styles.finalPriceMobile]}
            dir="ltr"
          >
            {product.final_price?.toFixed(2)} EGP
          </Text>
          {product.price > product.final_price && (
            <Text
              style={[styles.oldPrice, isMobile && styles.oldPriceMobile]}
              dir="ltr"
            >
              {product.price?.toFixed(2)} EGP
            </Text>
          )}
        </View>

        {isDesktop && (
          <View style={styles.purchaseControls}>
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
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
                  name={isInCart ? "remove-shopping-cart" : "add-shopping-cart"}
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
          title="الجرعة"
          content={
            product.dosage ||
            "يرجى استشارة الطبيب أو الصيدلي لمعرفة الجرعة المناسبة."
          }
        />

        <Accordion
          title="طريقة الاستخدام"
          content={
            product.usage_instructions ||
            "لا توجد تحذيرات محددة. يرجى قراءة النشرة الداخلية."
          }
        />
      </View>

      {!isDesktop && <TrustMarkersList />}
    </View>
  );
};

export default ProductInfo;
