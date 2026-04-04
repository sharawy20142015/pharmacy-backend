import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./FloatingButton.styles";
import { COLORS } from "../../../../theme/colors";
const FloatingButton = () => {
  return (
    <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
      <MaterialIcons name="chat" size={24} color={COLORS.white} />
      <Text style={styles.fabText}>Consult Now</Text>
    </TouchableOpacity>
  );
};
export default FloatingButton;
