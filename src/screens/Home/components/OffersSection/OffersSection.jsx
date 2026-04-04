import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./OffersSection.styles";
import { COLORS } from "../../../../theme/colors";
import { productService } from "../../../../services/productService"; // تأكد من صحة المسار

const OffersSection = () => {
  const { width } = useWindowDimensions();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDesktop = width >= 1024;
  const cardWidth = isDesktop ? (width - 100) / 2 : 300;

  // جلب البيانات من الـ API عند فتح الصفحة
  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await productService.getOffers();
        setOffers(data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, []);

  if (loading) {
    return (
      <View style={[styles.section, { padding: 20, alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // لو مفيش عروض حالياً ميعرضش السكشن خالص
  if (offers.length === 0) return null;

  return (
    <View style={styles.section}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          isDesktop && { justifyContent: "space-between", width: "100%" },
        ]}
      >
        {offers.map((offer, index) => {
          // التبديل بين الستايلات (أول كارت Primary والباقي Secondary)
          const isFirst = index === 0;
          const cardStyle = isFirst ? styles.cardPrimary : styles.cardSecondary;
          const badgeStyle = isFirst
            ? styles.badgePrimary
            : styles.badgeSecondary;
          const btnStyle = isFirst ? styles.btnPrimary : styles.btnSecondary;
          const iconColor = isFirst ? COLORS.primary : COLORS.secondary;

          return (
            <View
              key={offer.id || index}
              style={[
                cardStyle,
                { width: cardWidth, marginLeft: isFirst || isDesktop ? 0 : 16 },
              ]}
            >
              <View style={styles.contentWrap}>
                <View style={badgeStyle}>
                  <Text style={styles.badgeText}>
                    {offer.category_name || "Special Offer"}
                  </Text>
                </View>

                <Text style={styles.title} numberOfLines={1}>
                  {offer.name}
                </Text>

                <Text style={styles.desc} numberOfLines={2}>
                  {offer.description || "Limited time offer on this product."}
                </Text>

                <TouchableOpacity style={btnStyle} activeOpacity={0.8}>
                  <Text style={styles.btnText}>Buy Now</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.iconWrap}>
                {/* هنا بنعرض الأيقونة أو ممكن تبدلها بـ Image لو حابب */}
                <MaterialIcons
                  name={isFirst ? "inventory-2" : "event-repeat"}
                  size={isDesktop ? 80 : 60}
                  color={iconColor}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default OffersSection;
