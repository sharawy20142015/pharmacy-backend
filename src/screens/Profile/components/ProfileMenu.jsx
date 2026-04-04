import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles, COLORS } from "../ProfileStyles";

const ProfileMenu = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.menuContainer}>
      <View style={styles.menuHeader}>
        <Text style={styles.menuTitle}>حسابي</Text>
      </View>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("OrdersHistory")}
      >
        <View style={styles.menuItemRight}>
          <MaterialIcons name="inventory-2" size={24} color={COLORS.slate400} />
          <Text style={styles.menuItemText}>طلباتي</Text>
        </View>
        <MaterialIcons name="chevron-left" size={24} color={COLORS.slate300} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemRight}>
          <MaterialIcons
            name="receipt-long"
            size={24}
            color={COLORS.slate400}
          />
          <Text style={styles.menuItemText}>روشتاتي الطبية</Text>
        </View>
        <MaterialIcons name="chevron-left" size={24} color={COLORS.slate300} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemRight}>
          <MaterialIcons name="location-on" size={24} color={COLORS.slate400} />
          <Text style={styles.menuItemText}>عناويني المسجلة</Text>
        </View>
        <MaterialIcons name="chevron-left" size={24} color={COLORS.slate300} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemRight}>
          <MaterialIcons name="payment" size={24} color={COLORS.slate400} />
          <Text style={styles.menuItemText}>طرق الدفع</Text>
        </View>
        <MaterialIcons name="chevron-left" size={24} color={COLORS.slate300} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
        <View style={styles.menuItemRight}>
          <MaterialIcons
            name="medical-information"
            size={24}
            color={COLORS.slate400}
          />
          <Text style={styles.menuItemText}>السجل الطبي</Text>
        </View>
        <MaterialIcons name="chevron-left" size={24} color={COLORS.slate300} />
      </TouchableOpacity>
    </View>
  );
};
export default ProfileMenu;
