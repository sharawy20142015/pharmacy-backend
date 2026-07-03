import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  PanResponder,
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { styles } from "./FilterSidebar.styles";

const FilterSidebar = ({
  categories = [],
  activeCategory,
  onCategoryChange,
  brands = [],
  selectedBrands = [],
  onToggleBrand,
  totalProductsCount,
  onClearFilters,
  onApplyFilters,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
  onSaleOnly,
  setOnSaleOnly,
  onClose,
}) => {
  const [brandSearch, setBrandSearch] = useState("");
  const [sliderWidth, setSliderWidth] = useState(0);

  const MAX_LIMIT_PRICE = 5000;
  const initialMaxPrice = useRef(MAX_LIMIT_PRICE);

  const filteredBrands = brands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase()),
  );

  const currentMaxPrice =
    maxPrice === "" ? MAX_LIMIT_PRICE : parseFloat(maxPrice) || 0;
  const sliderPercentage = Math.min(
    Math.max(currentMaxPrice / MAX_LIMIT_PRICE, 0),
    1,
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,

      onPanResponderGrant: (evt) => {
        if (sliderWidth <= 0) return;
        const touchX = evt.nativeEvent.locationX;
        const percent = Math.max(0, Math.min(1, touchX / sliderWidth));
        const calculatedPrice = Math.round(percent * MAX_LIMIT_PRICE);

        setMaxPrice(calculatedPrice.toString());
        initialMaxPrice.current = calculatedPrice;
      },

      onPanResponderMove: (evt, gestureState) => {
        if (sliderWidth <= 0) return;

        const deltaPrice = (gestureState.dx / sliderWidth) * MAX_LIMIT_PRICE;
        const newPrice = Math.max(
          0,
          Math.min(
            MAX_LIMIT_PRICE,
            Math.round(initialMaxPrice.current + deltaPrice),
          ),
        );

        setMaxPrice(newPrice.toString());
      },
    }),
  ).current;

  return (
    <View style={styles.sidebarContainer}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#161d19" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الفلاتر</Text>
        <TouchableOpacity onPress={onClearFilters}>
          <Text style={styles.clearAllText}>مسح الكل</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="grid-outline"
              size={18}
              color="#161d19"
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>الأقسام</Text>
          </View>
          <View style={styles.capsuleContainer}>
            <TouchableOpacity
              style={[
                styles.capsule,
                activeCategory === null && styles.capsuleActive,
              ]}
              onPress={() => onCategoryChange(null)}
            >
              <Text
                style={[
                  styles.capsuleText,
                  activeCategory === null && styles.capsuleTextActive,
                ]}
              >
                كل المنتجات
              </Text>
            </TouchableOpacity>
            {categories &&
              categories.map((cat, idx) => (
                <TouchableOpacity
                  key={cat.id || idx}
                  style={[
                    styles.capsule,
                    activeCategory === cat.slug && styles.capsuleActive,
                  ]}
                  onPress={() => onCategoryChange(cat.slug)}
                >
                  <Text
                    style={[
                      styles.capsuleText,
                      activeCategory === cat.slug && styles.capsuleTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="verified-user"
              size={18}
              color="#161d19"
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>العلامات التجارية</Text>
          </View>

          <View style={styles.searchContainer}>
            <MaterialIcons
              name="search"
              size={20}
              color="#6c7a71"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن ماركة..."
              value={brandSearch}
              onChangeText={setBrandSearch}
              placeholderTextColor="#6c7a71"
            />
          </View>

          <View style={styles.brandWrapper}>
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              style={styles.brandList}
            >
              {filteredBrands.map((brand, idx) => {
                const isChecked = selectedBrands.includes(brand);
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.brandRow}
                    onPress={() => onToggleBrand(brand)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && styles.checkboxChecked,
                      ]}
                    >
                      {isChecked && (
                        <MaterialIcons name="check" size={14} color="#fff" />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.brandLabel,
                        isChecked && styles.brandLabelChecked,
                      ]}
                    >
                      {brand}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <FontAwesome5
              name="money-bill-wave"
              size={16}
              color="#161d19"
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>نطاق السعر (ر.س)</Text>
          </View>

          <View
            style={styles.sliderMockContainer}
            onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
            {...panResponder.panHandlers}
          >
            <View style={styles.sliderLine} pointerEvents="none">
              <View
                style={[
                  styles.sliderActiveLine,
                  { width: `${sliderPercentage * 100}%` },
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${sliderPercentage * 100}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.priceInputRow}>
            <View style={styles.priceInputBox}>
              <Text style={styles.priceLabel}>من</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                placeholder="0"
                value={minPrice}
                onChangeText={setMinPrice}
              />
            </View>
            <View style={styles.priceInputBox}>
              <Text style={styles.priceLabel}>إلى</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                placeholder="5000"
                value={maxPrice === "" ? "" : maxPrice}
                onChangeText={setMaxPrice}
              />
            </View>
          </View>
        </View>

        <View style={styles.switchSection}>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <MaterialIcons name="store" size={22} color="#11b67f" />
              <Text style={styles.switchLabel}>المتوفر في المخزن فقط</Text>
            </View>
            <Switch
              value={inStockOnly}
              onValueChange={setInStockOnly}
              trackColor={{ false: "#bbcac0", true: "#11b67f" }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <MaterialIcons name="local-offer" size={20} color="#ba1a1a" />
              <Text style={styles.switchLabel}>العروض والخصومات</Text>
            </View>
            <Switch
              value={onSaleOnly}
              onValueChange={setOnSaleOnly}
              trackColor={{ false: "#bbcac0", true: "#11b67f" }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.applyButton} onPress={onApplyFilters}>
          <Text style={styles.applyButtonText}>
            تطبيق الفلاتر ({totalProductsCount || "0"} منتج)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(FilterSidebar);
