import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles, COLORS } from "../ProfileStyles";

const StatsGrid = ({ points, pendingPoints, pointsInMoney }) => {
  return (
    <View style={styles.pointsCard}>
      {/* 🟢 الهيدر */}
      <View style={styles.pointsHeader}>
        <View style={styles.pointsIconWrapper}>
          <MaterialIcons name="stars" size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.pointsTitle}>نقاط الولاء الخاصة بك</Text>
      </View>

      {/* 🟢 الأرقام (في المنتصف) */}
      <View style={styles.pointsBody}>
        <Text style={styles.pointsValue}>{points?.toLocaleString() || 0}</Text>
        <Text style={styles.pointsSubtitle}>
          تعادل {pointsInMoney} ج.م رصيد خصم
        </Text>

        {/* النقاط المعلقة */}
        {pendingPoints > 0 && (
          <View style={styles.pendingBadge}>
            <MaterialIcons name="hourglass-empty" size={14} color="#b48600" />
            <Text style={styles.pendingText}>
              {pendingPoints?.toLocaleString()} نقطة قيد الانتظار
            </Text>
          </View>
        )}
      </View>

      {/* 🟢 الزرار */}
      <TouchableOpacity
        style={[styles.pointsBtn, points === 0 && { opacity: 0.7 }]}
        disabled={points === 0}
      >
        <Text style={styles.pointsBtnText}>استبدال النقاط الآن</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StatsGrid;
