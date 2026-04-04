import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../ProfileStyles";

const SupportCard = ({ onLogout }) => {
  // 🟢 ستايلات مخصصة للكارت عشان نضمن الشكل المودرن والثابت
  const localStyles = {
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 24,
      padding: 24,
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.slate200,
      ...Platform.select({
        web: { boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.04)" },
        android: { elevation: 3 },
      }),
    },
    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: COLORS.primary + "15", // أخضر شفاف 15%
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    title: {
      fontFamily: "Tajawal_700Bold",
      fontSize: 18,
      color: COLORS.slate900,
      marginBottom: 8,
      textAlign: "center",
    },
    description: {
      fontFamily: "Tajawal_400Regular",
      fontSize: 14,
      color: COLORS.slate500,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 22,
    },
    supportBtn: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.slate50, // رصاصي فاتح جداً
      borderWidth: 1,
      borderColor: COLORS.slate200,
      width: "100%",
      height: 52, // نفس ارتفاع زراير العنوان
      borderRadius: 14,
      gap: 8,
      ...Platform.select({
        web: { cursor: "pointer", transition: "all 0.2s ease" },
      }),
    },
    supportBtnText: {
      fontFamily: "Tajawal_700Bold",
      color: COLORS.slate700,
      fontSize: 15,
    },
    logoutWrapper: {
      marginTop: 16,
      width: "100%",
    },
    logoutBtn: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.red500 + "10", // أحمر شفاف 10% (Soft Red)
      width: "100%",
      height: 52,
      borderRadius: 14,
      gap: 8,
      ...Platform.select({
        web: { cursor: "pointer" },
      }),
    },
    logoutBtnText: {
      fontFamily: "Tajawal_700Bold",
      fontSize: 15,
      color: COLORS.red500,
    },
  };

  return (
    <>
      {/* 🟢 كارت الدعم الفني */}
      <View style={localStyles.card}>
        <View style={localStyles.iconWrapper}>
          <MaterialIcons
            name="support-agent"
            size={32}
            color={COLORS.primary}
          />
        </View>
        <Text style={localStyles.title}>هل تحتاج لمساعدة؟</Text>
        <Text style={localStyles.description}>
          صيادلتنا متواجدون لخدمتك والرد على استفساراتك الطبية 24/7
        </Text>
        <TouchableOpacity style={localStyles.supportBtn}>
          <MaterialIcons name="chat" size={18} color={COLORS.slate500} />
          <Text style={localStyles.supportBtnText}>تحدث مع صيدلي الآن</Text>
        </TouchableOpacity>
      </View>

      {/* 🟢 زرار تسجيل الخروج (بشكل منفصل وأنيق) */}
      <View style={localStyles.logoutWrapper}>
        <TouchableOpacity onPress={onLogout} style={localStyles.logoutBtn}>
          <MaterialIcons name="logout" size={20} color={COLORS.red500} />
          <Text style={localStyles.logoutBtnText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SupportCard;
