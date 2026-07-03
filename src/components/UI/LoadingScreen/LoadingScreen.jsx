import React from "react";
import { View, Text, ActivityIndicator, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./LoadingScreen.styles";
import { COLORS } from "../../../theme/colors";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.centerContent}>
        <View style={styles.logoSection}>
          <View style={styles.logoIconWrap}>
            <MaterialIcons
              name="health-and-safety"
              size={50}
              color={COLORS.white || "#ffffff"}
            />
          </View>

          <Text style={styles.logoText}>
            Nabd <Text style={styles.logoTextHighlight}>Pharmacy</Text>
          </Text>
        </View>

        <View style={styles.spinnerContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ transform: [{ scale: 1.3 }] }}
          />
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      </View>
    </View>
  );
};

export default LoadingScreen;
