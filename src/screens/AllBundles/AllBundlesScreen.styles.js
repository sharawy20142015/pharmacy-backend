// src/screens/AllBundles/AllBundlesScreen.styles.js

import { StyleSheet, Platform } from "react-native";

const COLORS = {
  primary: "#006c49",
  primaryContainer: "#11b67f",
  background: "#f4fbf4",
  surfaceCard: "#ffffff",
  textMain: "#161d19",
  textSecondary: "#3c4a42",
  outline: "rgba(187, 202, 192, 0.3)",
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 70,
    backgroundColor: "rgba(244, 251, 244, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#e8f0e9",
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    fontFamily: "Tajawal_700Bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120, // أمان عشان الـ Bottom Nav
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
  },

  // نصوص الهيرو العلوية
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textMain,
    textAlign: "right",
    fontFamily: "Tajawal_700Bold",
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "right",
    fontFamily: "Tajawal_500Medium",
    marginBottom: 32,
    lineHeight: 24,
  },

  // شبكة الكروت (Grid)
  gridContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },

  // استايل كارت الباقة
  cardContainer: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.outline,
    marginBottom: 16,
    ...Platform.select({
      web: { transition: "transform 0.3s ease, box-shadow 0.3s ease" },
    }),
  },
  cardHovered: {
    ...Platform.select({
      web: {
        transform: "translateY(-6px)",
        boxShadow: "0px 20px 40px rgba(15, 23, 42, 0.08)",
      },
    }),
  },
  imageWrapper: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
    marginBottom: 16,
    position: "relative",
  },
  bundleImage: {
    width: "100%",
    height: "100%",
  },
  categoryTag: {
    position: "absolute",
    bottom: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Tajawal_700Bold",
  },
  cardContent: {
    flex: 1,
  },
  bundleTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textMain,
    fontFamily: "Tajawal_700Bold",
    textAlign: "right",
    marginBottom: 16,
  },
  footerGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: "Tajawal_500Medium",
    marginBottom: 4,
    textAlign: "right",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.primary,
    fontFamily: "Tajawal_700Bold",
    textAlign: "right",
  },
  ctaButton: {
    backgroundColor: COLORS.primaryContainer,
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
