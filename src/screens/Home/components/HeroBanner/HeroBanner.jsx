import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image, // 👈 غيرنا ImageBackground لـ Image العادية
  Animated,
  TouchableOpacity,
  useWindowDimensions, // 👈 هنستخدمه لظبط العرض
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./HeroBanner.styles";
import apiClient from "../../../../services/apiClient";

const HeroBanner = () => {
  const { width } = useWindowDimensions(); // 👈 سحبنا عرض الشاشة
  const isDesktop = width >= 1024;

  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 1. جلب البانرات
  useEffect(() => {
    let isMounted = true;

    const fetchBanners = async () => {
      try {
        const response = await apiClient.get("/banners/");
        const data = response.data;
        const activeBanners = data
          .filter((b) => b.is_active === 1 || b.is_active === true)
          .filter((b) => b.image_url);

        if (isMounted) {
          if (activeBanners.length > 0) {
            setBanners(activeBanners);
          } else {
            setBanners([
              {
                image_url:
                  "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=1200&q=80",
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Failed to load banners:", error);
      }
    };

    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. تشغيل السلايدر
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0)
    return (
      <View
        style={[styles.container, isDesktop && styles.containerDesktop]}
      ></View>
    );

  const currentBanner = banners[currentIndex];

  const handleBannerPress = () => {
    if (currentBanner.category_id) {
      navigation.navigate("Store", { categoryId: currentBanner.category_id });
    } else if (currentBanner.target_screen) {
      navigation.navigate(currentBanner.target_screen);
    }
  };

  return (
    // 👇 طبقنا الستايل المخصص للديسكتوب لو الشاشة عريضة
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      <Animated.View style={[styles.imageWrapper, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.touchable}
          activeOpacity={0.9}
          onPress={handleBannerPress}
        >
          {/* 👇 استخدمنا Image عشان بتسمح بتحكم أفضل في الـ Aspect Ratio */}
          <Image
            source={{ uri: currentBanner.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default HeroBanner;
