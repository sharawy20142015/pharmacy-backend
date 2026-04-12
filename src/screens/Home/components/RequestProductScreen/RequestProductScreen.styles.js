import { StyleSheet, Platform } from "react-native";

export const COLORS = {
  primary: "#10b77f", // اللون الأخضر بتاعك
  primaryDark: "#0c8c61", // درجة أغمق للظلال
  primaryLight: "#e6f7f1", // درجة فاتحة جداً لخلفية الأيقونات
  secondary: "#38bdf8",
  backgroundLight: "#f6f8f7",
  backgroundDark: "#0f172a",
  accentGold: "#FACC15",
  white: "#ffffff",
  black: "#000000",
  slate900: "#0f172a",
  slate700: "#334155",
  slate500: "#64748b",
  slate200: "#e2e8f0",
  red500: "#ef4444",
  border: "#e2e8f0",
  textDark: "#0f172a",
  textLight: "#64748b",
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        zIndex: 1,
      },
      android: { elevation: 3 },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center", // لتوسيط الفورم في الشاشات الكبيرة
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
      },
      android: { elevation: 8 },
    }),
    width: "100%",
    alignSelf: "center",
  },
  headerSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 10,
    textAlign: "right",
  },
  inputWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 1.5,
    borderColor: "transparent", // شفاف في الحالة العادية
    borderRadius: 16,
    paddingHorizontal: 16,
    transition: "all 0.3s ease", // أنيميشن للويب
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: COLORS.textDark,
    textAlign: "right",
    ...(Platform.OS === "web" && { outlineStyle: "none" }),
  },
  textAreaWrapper: {
    alignItems: "flex-start",
    paddingTop: 16,
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
    paddingVertical: 0,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.slate200,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
