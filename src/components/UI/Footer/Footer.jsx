import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions, // استبدال useWindowDimensions بـ Dimensions المستقرة 🚀
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./Footer.styles";
import { COLORS } from "../../../theme/colors";

const Footer = () => {
  // 🟢 مراقبة العرض فقط ومنع الفوتر من الريندر عند فتح الكيبورد
  const [width, setWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      if (window.width !== width) {
        setWidth(window.width);
      }
    });
    return () => subscription?.remove();
  }, [width]);

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

        {/* العمود الرابع: التواصل */}
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
        </View>
      </View>

      {/* الجزء السفلي: الحقوق */}
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
