import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../theme/colors";

const THEME_GREEN = COLORS?.primary || "#10b77f";

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12, // 👈 خليناه 12 عشان يبقى مودرن وشبه كارت المتجر
    borderWidth: 1,
    borderColor: "#e2e8f0",
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
    backgroundColor: "#ffffff",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: 2, // 👈 السر هنا: البادينج 2 بيخلي الصورة تفرش وتملى الكارت للآخر
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
    top: 6, // 👈 رفعناه لفوق شوية
    left: 6,
    backgroundColor: THEME_GREEN,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 10,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0,
  },
  discountBadge: {
    position: "absolute",
    top: 6, // 👈 رفعناه لفوق شوية
    right: 6,
    backgroundColor: "#ef4444",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 10,
  },
  discountBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "900",
  },
  wishlistBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 28, // 👈 صغرنا زرار الأمنيات
    height: 28,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 5,
  },
  detailsContainer: {
    padding: 10, // 👈 قللنا المساحة الداخلية للبيانات
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  brandText: {
    fontSize: 10, // 👈 خط أصغر
    color: "#64748b",
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 2,
    textAlign: "left",
  },
  titleText: {
    fontSize: 12, // 👈 صغرنا اسم المنتج عشان يتناسب مع الكارت
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 16,
    minHeight: 32, // 👈 ارتفاع لسطرين فقط
    marginBottom: 4,
    textAlign: "left",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 4,
    marginBottom: 10,
  },
  priceColumn: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  oldPrice: {
    fontSize: 10,
    color: "#94a3b8",
    textDecorationLine: "line-through",
    marginBottom: 1,
  },
  mainPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  priceText: {
    fontSize: 14, // 👈 السعر أصغر وأنعم
    fontWeight: "900",
    color: THEME_GREEN,
  },
  currencyText: {
    fontSize: 9,
    fontWeight: "bold",
    color: THEME_GREEN,
  },
  addToCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: THEME_GREEN,
    paddingVertical: 8, // 👈 رفعنا الزرار شوية (أنحف)
    borderRadius: 8,
    gap: 6,
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
    fontSize: 13, // 👈 خط الزرار أصغر
    fontWeight: "800",
  },
  removeFromCartBtn: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
});
