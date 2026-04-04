import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    maxWidth: 1280, // عشان لو فتحته ويب
    alignSelf: "center",
    width: "100%",
  },
});
