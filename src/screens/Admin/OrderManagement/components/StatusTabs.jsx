import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../../../theme/colors";

const StatusTabs = ({ activeFilter, onSelectFilter, config }) => {
  return (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {Object.keys(config).map((key) => {
          const isActive = activeFilter === key;
          const statusObj = config[key];
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterTab,
                isActive && {
                  backgroundColor: statusObj.color,
                  borderColor: statusObj.color,
                },
              ]}
              onPress={() => onSelectFilter(key)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isActive && { color: COLORS.white },
                ]}
              >
                {statusObj.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: { paddingVertical: 15 },
  filterScroll: { paddingHorizontal: 15, gap: 10 },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  filterTabText: { fontSize: 14, fontWeight: "600", color: COLORS.slate500 },
});

export default StatusTabs;
