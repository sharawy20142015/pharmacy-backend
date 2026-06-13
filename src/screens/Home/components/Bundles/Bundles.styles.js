// src/screens/Home/components/Bundles/Bundles.styles.js

import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    backgroundColor: "transparent",
  },
  // 🟢 تعديل الاتجاه ليصبح صف طبيعي من اليسار لليمين للحفاظ على تناسق الإنجليزي
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // مسافة بين الخط الأخضر والكلام
  },
  indicator: {
    width: 5,
    height: 24,
    backgroundColor: "#11b67f", // نفس لون الخط الأخضر للـ Category
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "left",
    fontFamily: "Tajawal_700Bold",
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 14,
    color: "#006c49",
    fontWeight: "700",
    fontFamily: "Tajawal_700Bold",
  },
  scrollContent: {
    paddingHorizontal: 16,
    flexDirection: "row-reverse", // تظل الكروت تنسحب من اليمين بشكل عربي ممتاز
  },
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    marginHorizontal: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(187, 202, 192, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: "#15172a",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.04,
        shadowRadius: 30,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.04)",
        cursor: "pointer",
      },
    }),
  },
  cardHovered: {
    ...Platform.select({
      web: {
        transform: [{ translateY: -8 }],
        boxShadow: "0px 20px 40px rgba(15, 23, 42, 0.08)",
      },
    }),
  },
  imageWrapper: {
    width: "100%",
    height: 220,
    position: "relative",
  },
  bundleImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#ba1a1a",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    zIndex: 10,
  },
  discountText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    fontFamily: "Tajawal_700Bold",
  },
  categoryTag: {
    position: "absolute",
    bottom: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    zIndex: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Tajawal_700Bold",
  },
  cardContent: {
    padding: 18,
    alignItems: "flex-end",
  },
  bundleTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#161d19",
    marginBottom: 16,
    textAlign: "right",
    fontFamily: "Tajawal_700Bold",
  },
  footerGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  priceLabel: {
    fontSize: 11,
    color: "#6c7a71",
    textAlign: "right",
    fontFamily: "Tajawal_500Medium",
    marginBottom: 2,
  },
  priceText: {
    fontSize: 19,
    fontWeight: "900",
    color: "#006c49",
    textAlign: "right",
  },
  ctaButton: {
    backgroundColor: "#11b67f",
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    gap: 4,
  },
  ctaText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Tajawal_700Bold",
  },
});

export default styles;
