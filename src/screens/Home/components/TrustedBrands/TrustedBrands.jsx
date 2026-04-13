import React from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { styles } from "./TrustedBrands.styles";

const TrustedBrands = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const mobileTopRow = [
    { en: "Panadol" },
    { en: "Pfizer" },
    { en: "Roche" },
    { en: "Novartis" },
    { en: "Bayer" },
  ];

  const mobileBottomRow = [
    {
      en: "L'ORÉAL",
      spaced: true,
      imgSrc:
        "https://www.loreal-paris-me.com/-/media/project/loreal/brand-sites/oap/shared/baseline/navigationext/loreal-paris-black-logo.svg",
    },
    { en: "VICHY", spaced: true },
    { en: "GSK" },
    { en: "AstraZeneca" },
    { en: "Sanofi" },
  ];

  // تكرار المصفوفة لملء الشاشة عند التمرير
  const infiniteTop = [...mobileTopRow, ...mobileTopRow, ...mobileTopRow];
  const infiniteBottom = [
    ...mobileBottomRow,
    ...mobileBottomRow,
    ...mobileBottomRow,
  ];

  // مكون فرعي لكارت الديسكتوب لتبسيط الكود
  const BentoCard = ({ colSpan, rowSpan, children, padding = 16 }) => (
    <View
      style={[
        styles.bentoCard,
        { padding },
        // تفعيل الـ CSS Grid على الويب فقط
        Platform.OS === "web" &&
          isDesktop && {
            gridColumn: `span ${colSpan} / span ${colSpan}`,
            gridRow: `span ${rowSpan} / span ${rowSpan}`,
          },
      ]}
    >
      {children}
    </View>
  );

  return (
    <View style={styles.section}>
      <View style={styles.contentWrapper}>
        {/* --- عرض الموبايل والتابلت (شريط التمرير) --- */}
        {!isDesktop && (
          <View style={styles.mobileView}>
            {/* الصف الأول */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollRow}
            >
              {infiniteTop.map((brand, i) => (
                <View key={`top-${i}`} style={styles.mobileCard}>
                  <Text
                    style={[
                      styles.mobileEn,
                      brand.spaced && { letterSpacing: 2 },
                    ]}
                  >
                    {brand.en}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* الصف الثاني */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollRow}
            >
              {infiniteBottom.map((brand, i) => (
                <View key={`bottom-${i}`} style={styles.mobileCard}>
                  {brand.imgSrc ? (
                    <Image
                      source={brand.imgSrc}
                      style={styles.mobileLogo}
                      contentFit="contain"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.mobileEn,
                        brand.spaced && { letterSpacing: 2 },
                      ]}
                    >
                      {brand.en}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* --- عرض الديسكتوب (Bento Grid) --- */}
        {isDesktop && (
          <View style={styles.desktopView}>
            <BentoCard colSpan={2} rowSpan={2} padding={32}>
              <Text
                style={[styles.brandEn, { fontSize: 48, letterSpacing: -1 }]}
              >
                Panadol
              </Text>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} padding={24}>
              <Text style={[styles.brandEn, { fontSize: 30 }]}>Pfizer</Text>
            </BentoCard>

            <BentoCard colSpan={1} rowSpan={1}>
              <Text style={[styles.brandEn, { fontSize: 20 }]}>Roche</Text>
            </BentoCard>

            <BentoCard colSpan={1} rowSpan={1}>
              <Text style={[styles.brandEn, { fontSize: 20 }]}>Novartis</Text>
            </BentoCard>

            {/* كارت لوريال (باستخدام اللوجو SVG) */}
            <BentoCard colSpan={2} rowSpan={1} padding={24}>
              <Image
                source="https://www.loreal-paris-me.com/-/media/project/loreal/brand-sites/oap/shared/baseline/navigationext/loreal-paris-black-logo.svg"
                style={styles.brandLogo}
                contentFit="contain"
              />
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={2} padding={32}>
              <Text style={[styles.brandEn, { fontSize: 36 }]}>Bayer</Text>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} padding={24}>
              <Text style={[styles.brandEn, { fontSize: 24 }]}>
                AstraZeneca
              </Text>
            </BentoCard>

            <BentoCard colSpan={1} rowSpan={1} padding={16}>
              <Text
                style={[styles.brandEn, { fontSize: 20, letterSpacing: 1 }]}
              >
                VICHY
              </Text>
            </BentoCard>

            <BentoCard colSpan={1} rowSpan={1} padding={16}>
              <Text style={[styles.brandEn, { fontSize: 20 }]}>GSK</Text>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} padding={24}>
              <Text style={[styles.brandEn, { fontSize: 24 }]}>Sanofi</Text>
            </BentoCard>
          </View>
        )}
      </View>
    </View>
  );
};

export default TrustedBrands;
