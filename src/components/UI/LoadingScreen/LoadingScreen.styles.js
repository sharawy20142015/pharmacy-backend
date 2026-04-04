import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // عشان يغطي أي حاجة وراه
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoIconWrap: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.slate900,
  },
  logoTextHighlight: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  spinnerContainer: {
    marginTop: 20,
  },
});
