import React from "react";
import { View, Text, useWindowDimensions, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./Features.styles";
import { COLORS } from "../../../../theme/colors";

const Features = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const featureData = [
    {
      id: 1,
      name: "Licensed Pharmacy",
      icon: "verified-user",
      desc: "Ministry of Health Certified",
    },
    {
      id: 2,
      name: "Expert Consultation",
      icon: "chat",
      desc: "24/7 Pharmacist Advice",
    },
    {
      id: 3,
      name: "Fast Delivery",
      icon: "local-shipping",
      desc: "Within 2 hours locally",
    },
  ];

  return (
    <View style={styles.section}>
      <ScrollView
        horizontal={!isDesktop}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.grid,
          isDesktop && {
            flexDirection: "row",
            justifyContent: "space-between",
          },
        ]}
      >
        {featureData.map((feature) => (
          <View key={feature.id} style={styles.featureItem}>
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name={feature.icon}
                size={28}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.textContainer}>
              <h4 style={styles.title}>{feature.name}</h4>
              <p style={styles.desc}>{feature.desc}</p>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Features;
