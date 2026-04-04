import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles, COLORS } from "../ProfileStyles";

const ProfileHeader = ({ userAvatar }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerRight}>
        <View style={styles.headerLogoIcon}>
          <MaterialIcons name="local-pharmacy" size={24} color={COLORS.white} />
        </View>
        <Text style={styles.headerTitle}>صيدلية كويس</Text>
      </View>
      <View style={styles.headerLeft}>
        <Image
          source={{
            uri:
              userAvatar ||
              "https://ui-avatars.com/api/?background=cbd5e1&color=475569",
          }}
          style={styles.headerAvatar}
        />
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons
            name="notifications"
            size={22}
            color={COLORS.slate600}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ProfileHeader;
