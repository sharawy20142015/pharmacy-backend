import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  section: {
    paddingVertical: Platform.OS === "web" ? 100 : 60,
    backgroundColor: "#f6f8f7",
    overflow: "hidden",
  },
  contentWrapper: {
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    zIndex: 10,
  },

  // --- Mobile View ---
  mobileView: {
    flexDirection: "column",
    gap: 20,
  },
  scrollRow: {
    gap: 16,
    paddingHorizontal: 16,
  },
  mobileCard: {
    width: 160,
    height: 90,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(16, 183, 72, 0.1)",
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
      web: { boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
    }),
  },
  mobileEn: {
    fontWeight: "800",
    fontSize: 18,
    color: "#1e293b",
  },
  mobileLogo: {
    width: 100,
    height: 35,
  },

  // --- Desktop View ---
  desktopView: {
    ...Platform.select({
      web: {
        display: "grid",
        gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
        gridAutoRows: 140,
        gap: 24,
      },
      default: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
      },
    }),
  },
  bentoCard: {
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(16, 183, 72, 0.1)",
    overflow: "hidden",
  },
  brandEn: {
    fontWeight: "900",
    color: "#1e293b",
  },
  brandLogo: {
    width: 140,
    height: 40,
  },
});
