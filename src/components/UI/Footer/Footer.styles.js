import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 60,
    paddingBottom: 40,
    marginTop: 80,
  },
  footerMainContent: {
    maxWidth: 1440,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    gap: 40,
  },
  column: {
    minWidth: 200,
    flex: 1,
    marginBottom: 30,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#64748b",
    maxWidth: 280,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 24,
  },
  linkItem: {
    marginBottom: 16,
  },
  linkText: {
    fontSize: 14,
    color: "#64748b",
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  socialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  hotlineBox: {
    backgroundColor: "rgba(16, 183, 127, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(16, 183, 127, 0.1)",
    padding: 16,
    borderRadius: 12,
  },
  hotlineLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 4,
  },
  hotlineNum: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
  },
  bottomBar: {
    maxWidth: 1440,
    width: "100%",
    alignSelf: "center",
    marginTop: 48,
    paddingTop: 32,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  copyText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  policyLinks: {
    flexDirection: "row",
    gap: 24,
  },
  policyText: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
