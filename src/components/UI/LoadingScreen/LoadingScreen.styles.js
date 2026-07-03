import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../../theme/colors";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
    backgroundColor: COLORS.white || "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoIconWrap: {
    backgroundColor: COLORS.primary,
    width: 90,
    height: 90,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1.5,
    textAlign: "center",
  },
  logoTextHighlight: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  spinnerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
