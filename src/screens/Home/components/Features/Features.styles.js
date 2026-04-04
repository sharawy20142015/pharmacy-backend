import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const styles = StyleSheet.create({
  section: {
    marginTop: 64, // mt-16
    backgroundColor: COLORS.white, // bg-white
    borderRadius: 16, // rounded-2xl
    padding: 32, // p-8
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)", // border-primary/5 (تقريبي)
    // Shadow للـ iOS/Android كبديل للـ Dark mode border
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  grid: {
    gap: 32, // gap-8
  },
  featureItem: {
    flexDirection: "row", // items-center gap-4
    alignItems: "center",
    minWidth: 250, // عشان في الموبايل ميكنش صغير اوي
    marginRight: 20, // مسافة بين العناصر في الـ Scroll الأفقي
  },
  iconWrapper: {
    width: 48, // w-12
    height: 48, // h-12
    backgroundColor: "rgba(var(--primary-rgb), 0.1)", // bg-primary/10 (استخدم لونك الشفاف هنا)
    borderRadius: 24, // rounded-full
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    marginLeft: 16, // gap-4
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a", // slate-900
    marginBottom: 2,
  },
  desc: {
    fontSize: 14,
    color: "#64748b", // slate-500
  },
});
