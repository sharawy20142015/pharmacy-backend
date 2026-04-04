import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  sidebarSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sideTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: 0.5,
  },
  selectedCount: {
    fontSize: 11,
    color: "#10b77f",
    fontWeight: "bold",
    backgroundColor: "rgba(16, 183, 127, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  listGroup: {
    gap: 4,
  },

  // --- Categories Styles ---
  sideItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  sideItemRowActive: {
    backgroundColor: "rgba(16, 183, 127, 0.08)",
  },
  sideItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeIndicator: {
    width: 4,
    height: 16,
    backgroundColor: "#10b77f",
    borderRadius: 4,
    marginRight: 8,
  },
  sideLinkLabel: {
    fontSize: 15,
    color: "#475569",
    fontWeight: "500",
  },
  sideLinkActive: {
    color: "#10b77f",
    fontWeight: "800",
  },
  countBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeActive: {
    backgroundColor: "#10b77f",
  },
  sideCountLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "700",
  },
  sideCountActive: {
    color: "#ffffff",
  },

  // --- Divider ---
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 20,
    marginHorizontal: 12,
  },

  // --- Brands Styles ---
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#ffffff",
  },
  checkboxBoxChecked: {
    backgroundColor: "#10b77f",
    borderColor: "#10b77f",
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#475569",
    fontWeight: "500",
  },
  checkboxLabelChecked: {
    color: "#0f172a",
    fontWeight: "700",
  },

  // 🟢 --- Filter Actions Styles (الزراير الجديدة) --- 🟢
  filterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    gap: 12,
    paddingHorizontal: 8,
    paddingBottom: 20, // مساحة من تحت عشان لو سكرول
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  clearBtnText: {
    color: "#475569",
    fontWeight: "bold",
    fontSize: 15,
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#10b77f",
    alignItems: "center",
    elevation: 2, // ظل خفيف للأندرويد
    shadowColor: "#10b77f", // ظل خفيف للـ iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  applyBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
