import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./LoadingScreen.styles";
import { COLORS } from "../../../theme/colors";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      {/* سكشن اللوجو والاسم */}
      <View style={styles.logoSection}>
        <View style={styles.logoIconWrap}>
          <MaterialIcons
            name="health-and-safety"
            size={40}
            color={COLORS.white}
          />
        </View>
        <Text style={styles.logoText}>
          Nabd <Text style={styles.logoTextHighlight}>Pharmacy</Text>
        </Text>
      </View>

      {/* شريط التحميل (السبينر) */}
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    </View>
  );
};

export default LoadingScreen;
