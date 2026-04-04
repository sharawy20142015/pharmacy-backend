import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./FilterSidebar.styles";

const SideItem = ({ label, count, active, onPress }) => (
  <TouchableOpacity
    style={[styles.sideItemRow, active && styles.sideItemRowActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.sideItemContent}>
      {active && <View style={styles.activeIndicator} />}
      <Text style={[styles.sideLinkLabel, active && styles.sideLinkActive]}>
        {label}
      </Text>
    </View>

    {/* 🟢 الدايرة دي مش هتظهر غير لو في رقم حقيقي ومش شرطة */}
    {count && count !== "-" && (
      <View style={[styles.countBadge, active && styles.countBadgeActive]}>
        <Text style={[styles.sideCountLabel, active && styles.sideCountActive]}>
          {count}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const CheckboxItem = ({ label, checked, onPress }) => (
  <TouchableOpacity
    style={styles.checkboxRow}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
      {checked && <MaterialIcons name="check" size={16} color="#fff" />}
    </View>
    <Text
      style={[styles.checkboxLabel, checked && styles.checkboxLabelChecked]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const FilterSidebar = ({
  categories = [],
  activeCategory,
  onCategoryChange,
  brands = [],
  selectedBrands = [],
  onToggleBrand,
  totalProductsCount,
  onClearFilters, // 🟢 بيمسح الفلاتر
  onApplyFilters, // 🟢 بيطبق الفلتر ويقفل المودال
}) => {
  return (
    <View style={styles.sidebarContainer}>
      {/* --- Categories Section --- */}
      <View style={styles.sidebarSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.titleWrapper}>
            <MaterialIcons name="category" size={22} color="#0f172a" />
            <Text style={styles.sideTitle}>Categories</Text>
          </View>
        </View>
        <View style={styles.listGroup}>
          <SideItem
            label="All Products"
            count={totalProductsCount || "0"}
            active={activeCategory === null}
            onPress={() => onCategoryChange(null)}
          />
          {categories.map((cat, idx) => (
            <SideItem
              key={idx}
              label={cat}
              count="-"
              active={activeCategory === cat}
              onPress={() => onCategoryChange(cat)}
            />
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      {/* --- Brands Section --- */}
      <View style={styles.sidebarSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.titleWrapper}>
            <MaterialIcons
              name="branding-watermark"
              size={22}
              color="#0f172a"
            />
            <Text style={styles.sideTitle}>Brands</Text>
          </View>
          {selectedBrands.length > 0 && (
            <Text style={styles.selectedCount}>
              {selectedBrands.length} Selected
            </Text>
          )}
        </View>
        <View style={styles.listGroup}>
          {brands.map((brand, idx) => (
            <CheckboxItem
              key={idx}
              label={brand}
              checked={selectedBrands.includes(brand)}
              onPress={() => onToggleBrand(brand)}
            />
          ))}
        </View>
      </View>

      {/* 🟢 --- Filter Actions (Clear & Apply Buttons) --- 🟢 */}
      <View style={styles.filterActions}>
        <TouchableOpacity style={styles.clearBtn} onPress={onClearFilters}>
          <Text style={styles.clearBtnText}>Clear All</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyBtn} onPress={onApplyFilters}>
          <Text style={styles.applyBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterSidebar;
