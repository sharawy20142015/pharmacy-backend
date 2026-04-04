import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../ProfileStyles";

const UserInfoCard = ({ userName, userEmail, getInitials }) => {
  // 🟢 ستايلات مخصصة للكارت عشان نضمن استجابته (Responsive) للموبايل
  const localStyles = {
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: COLORS.slate200,
      gap: 16, // بيعمل مسافة بين صف البيانات وزرار التعديل
      ...Platform.select({
        web: { boxShadow: "0px 4px 15px rgba(0,0,0,0.03)" },
        android: { elevation: 2 },
      }),
    },
    topRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 16,
    },
    avatarWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: COLORS.primary + "15",
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontFamily: "Tajawal_700Bold",
      fontSize: 22,
      color: COLORS.primary,
    },
    textCol: {
      flex: 1, // بياخد باقي المساحة كلها براحته
      alignItems: "flex-end",
      justifyContent: "center",
    },
    name: {
      fontFamily: "Tajawal_700Bold",
      fontSize: 18,
      color: COLORS.slate900,
      textAlign: "right",
      marginBottom: 4,
    },
    email: {
      fontFamily: "Tajawal_400Regular",
      fontSize: 13,
      color: COLORS.slate500,
      textAlign: "right",
    },
    editBtn: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.slate50,
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.slate200,
      gap: 6,
      ...Platform.select({
        web: { cursor: "pointer" },
      }),
    },
    editBtnText: {
      fontFamily: "Tajawal_700Bold",
      fontSize: 13,
      color: COLORS.slate700,
    },
  };

  return (
    <View style={localStyles.card}>
      {/* 🟢 الصف العلوي: الصورة والبيانات (واخدين راحتهم في المساحة) */}
      <View style={localStyles.topRow}>
        <View style={localStyles.avatarWrapper}>
          <Text style={localStyles.avatarText}>{getInitials(userName)}</Text>
        </View>
        <View style={localStyles.textCol}>
          {/* استخدمنا adjustsFontSizeToFit عشان لو الإيميل طويل جداً يصغر الفونت سنة بسيطة بدل ما يتقص */}
          <Text style={localStyles.name} numberOfLines={1} adjustsFontSizeToFit>
            {userName}
          </Text>
          <Text
            style={localStyles.email}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {userEmail}
          </Text>
        </View>
      </View>

      {/* 🟢 الصف السفلي: زرار التعديل */}
      {/* <TouchableOpacity style={localStyles.editBtn}>
        <MaterialIcons name="edit" size={16} color={COLORS.slate600} />
        <Text style={localStyles.editBtnText}>تعديل البيانات</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default UserInfoCard;
