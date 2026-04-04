import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./Footer.styles";
import { COLORS } from "../../../theme/colors";

const Footer = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={styles.footerWrapper}>
      <View style={styles.footerMainContent}>
        {/* العمود الأول: اللوجو والوصف */}
        <View style={[styles.column, isDesktop && { flex: 1.5 }]}>
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <MaterialIcons
                name="medical-services"
                size={18}
                color={COLORS.white}
              />
            </View>
            <Text style={styles.brandTitle}>Nabd Pharmacy</Text>
          </View>
          <Text style={styles.description}>
            Premium pharmaceutical care for your daily needs. Your trusted
            partner in health and wellness.
          </Text>
        </View>

        {/* العمود الثاني: الخدمات */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Services</Text>
          {[
            "Prescription Pickup",
            "VIP Chronic Program",
            "Health Consultation",
            "Medical Reports",
          ].map((link, i) => (
            <TouchableOpacity key={i} style={styles.linkItem}>
              <Text style={styles.linkText}>{link}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* العمود الثالث: خدمة العملاء */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Customer Care</Text>
          {[
            "Help Center",
            "Track Order",
            "Returns & Refunds",
            "Delivery Info",
          ].map((link, i) => (
            <TouchableOpacity key={i} style={styles.linkItem}>
              <Text style={styles.linkText}>{link}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* العمود الرابع: التواصل والخط الساخن */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Stay Connected</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialCircle}>
              <MaterialCommunityIcons
                name="facebook"
                size={20}
                color={COLORS.slate700}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialCircle}>
              <MaterialCommunityIcons
                name="instagram"
                size={20}
                color={COLORS.slate700}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.hotlineBox}>
            <Text style={styles.hotlineLabel}>EMERGENCY HOTLINE</Text>
            <Text style={styles.hotlineNum}>19999</Text>
          </View>
        </View>
      </View>

      {/* الجزء السفلي: الحقوق والسياسات */}
      <View style={styles.bottomBar}>
        <Text style={styles.copyText}>
          © 2024 Nabd Pharmacy. All rights reserved.
        </Text>
        <View style={styles.policyLinks}>
          <Text style={styles.policyText}>Privacy Policy</Text>
          <Text style={styles.policyText}>Terms of Service</Text>
        </View>
      </View>
    </View>
  );
};

export default Footer;
