import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../ProductDetailsScreen.styles";

export const TrustMarkersList = () => (
  <View style={styles.trustMarkers}>
    <TrustItem icon="verified-user" text="موثق من صيادلة مرخصين" />
    <TrustItem icon="thermostat" text="توصيل مبرد ومراقب" />
    <TrustItem icon="bolt" text="توصيل سريع" />
  </View>
);

const TrustItem = ({ icon, text }) => (
  <View style={styles.trustItem}>
    <View style={styles.trustIconBg}>
      <MaterialIcons name={icon} size={20} color="#11b67f" />
    </View>
    <Text style={styles.trustText} numberOfLines={2}>
      {text}
    </Text>
  </View>
);

export const QuantitySelector = ({ quantity, setQuantity }) => (
  <View style={styles.qtyBox}>
    <TouchableOpacity
      onPress={() => setQuantity((q) => Math.max(1, q - 1))}
      style={styles.qtyBtn}
    >
      <MaterialIcons name="remove" size={20} color="#475569" />
    </TouchableOpacity>
    <Text style={styles.qtyText}>{quantity}</Text>
    <TouchableOpacity
      onPress={() => setQuantity((q) => q + 1)}
      style={styles.qtyBtn}
    >
      <MaterialIcons name="add" size={20} color="#475569" />
    </TouchableOpacity>
  </View>
);

export const Accordion = ({ title, content }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={styles.accordionHeader}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <MaterialIcons
          name={open ? "expand-less" : "expand-more"}
          size={26}
          color="#0f172a"
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.accordionBody}>
          <Text style={styles.accordionContent}>{content}</Text>
        </View>
      )}
    </View>
  );
};
