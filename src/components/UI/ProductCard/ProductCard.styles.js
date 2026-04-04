import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../theme/colors";

// هنفترض اللون الأخضر من ثيم السيستم بتاعك أو هنحط لون افتراضي
const THEME_GREEN = COLORS.primary || "#10b77f";

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0", // رمادي فاتح جداً
    overflow: "hidden",
    flex: 1,
    // Transitions for Web
    ...Platform.select({
      web: {
        transition: "all 0.3s ease",
      },
    }),
  },
  cardHovered: {
    borderColor: THEME_GREEN,
    shadowColor: THEME_GREEN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  imageWrapper: {
    aspectRatio: 1,
    backgroundColor: "#f8fafc",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    ...Platform.select({
      web: {
        transition: "transform 0.4s ease",
      },
    }),
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: THEME_GREEN,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  wishlistBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsContainer: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  brandText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 20,
    height: 40, // يحافظ على ارتفاع ثابت لسطرين
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginBottom: 16,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME_GREEN,
  },
  currencyText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME_GREEN,
  },
  addToCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: THEME_GREEN,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    ...Platform.select({
      web: {
        transition: "all 0.3s ease",
      },
    }),
  },
  addToCartBtnHovered: {
    backgroundColor: THEME_GREEN,
  },
  addToCartText: {
    color: THEME_GREEN,
    fontSize: 14,
    fontWeight: "700",
  },
});
