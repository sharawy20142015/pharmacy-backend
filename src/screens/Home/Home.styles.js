import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../theme/colors";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "web" ? 60 : 100,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    maxWidth: 1280,
    alignSelf: "center",
    width: "100%",
  },
  sectionGap: {
    marginTop: 24,
    width: "100%",
  },
});
