import { StyleSheet, Dimensions, Platform } from "react-native";
import { COLORS } from "../../../theme/colors";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    // نستخدم absoluteFillObject عشان يفرش على الشاشة كلها فوق أي عناصر تانية
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
    backgroundColor: COLORS.white || "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999, // أعلى طبقة ممكنة
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  logoIconWrap: {
    backgroundColor: COLORS.primary,
    width: 90, // أبعاد ثابتة للدائرة عشان نضمن التناسق
    height: 90,
    borderRadius: 30, // تدويرة عصرية
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // شادو احترافي (Neumorphism style بسيط)
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0f172a", // Slate 900
    letterSpacing: -1.5,
    textAlign: "center",
  },
  logoTextHighlight: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  spinnerContainer: {
    position: "absolute",
    bottom: height * 0.15, // وضع الـ Spinner تحت اللوجو بمسافة كويسة
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748b", // Slate 500
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
