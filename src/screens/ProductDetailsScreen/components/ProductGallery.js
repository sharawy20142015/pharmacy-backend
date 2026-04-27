import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../ProductDetailsScreen.styles";
import { TrustMarkersList } from "./SharedUI";

const ProductGallery = ({ images }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isDesktop = width >= 1024;

  const [activeImg, setActiveImg] = useState(0);
  const mainImage =
    images[activeImg] || images[0] || "https://via.placeholder.com/400";

  const goToNext = () => {
    if (activeImg < images.length - 1) setActiveImg(activeImg + 1);
  };
  const goToPrev = () => {
    if (activeImg > 0) setActiveImg(activeImg - 1);
  };

  return (
    <View style={[styles.galleryCol, isDesktop && { flex: 7 }]}>
      <View style={[styles.imageBox, isMobile && styles.imageBoxMobile]}>
        <Pressable style={styles.img3DWrapper}>
          {({ hovered }) => (
            <>
              <Image
                source={{ uri: mainImage }}
                style={[
                  styles.mainImg,
                  isMobile && styles.mainImgMobile,
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
              <View
                style={[
                  styles.productFloorShadow,
                  isMobile && styles.productFloorShadowMobile,
                  hovered &&
                    !isMobile && {
                      transform: [{ scaleX: 0.6 }],
                      opacity: 0.05,
                    },
                  Platform.OS === "web" && { transition: "all 0.5s ease" },
                ]}
              />
            </>
          )}
        </Pressable>

        {images.length > 1 && activeImg > 0 && (
          <TouchableOpacity
            onPress={goToPrev}
            style={[styles.arrowBtn, styles.arrowLeft]}
          >
            <MaterialIcons name="chevron-left" size={28} color="#007AFF" />
          </TouchableOpacity>
        )}
        {images.length > 1 && activeImg < images.length - 1 && (
          <TouchableOpacity
            onPress={goToNext}
            style={[styles.arrowBtn, styles.arrowRight]}
          >
            <MaterialIcons name="chevron-right" size={28} color="#007AFF" />
          </TouchableOpacity>
        )}

        {images.length > 1 && (
          <View style={styles.dotsContainer}>
            {images.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  activeImg === idx ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

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
                isMobile && styles.thumbItemMobile,
                activeImg === idx && styles.thumbItemActive,
              ]}
            >
              <Image
                source={{ uri: img }}
                style={styles.thumbImg}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {isDesktop && <TrustMarkersList />}
    </View>
  );
};

export default ProductGallery;
