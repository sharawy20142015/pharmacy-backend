import React from "react";
import { View, Text, ActivityIndicator, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./LoadingScreen.styles";
import { COLORS } from "../../../theme/colors";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      {/* تأكد إن شريط الحالة متناسق مع الخلفية */}
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.logoSection}>
        <View style={styles.logoIconWrap}>
          <MaterialIcons
            name="health-and-safety"
            size={50} // كبرنا الأيقونة شوية
            color={COLORS.white || "#ffffff"}
          />
        </View>

        <Text style={styles.logoText}>
          Nabd <Text style={styles.logoTextHighlight}>Pharmacy</Text>
        </Text>
      </View>

      <View style={styles.spinnerContainer}>
        {/* حجم large ولون البراند يخلي الشكل متناسق جداً */}
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ transform: [{ scale: 1.3 }] }} // تكبير بسيط للـ Spinner
        />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    </View>
  );
};

export default LoadingScreen;
