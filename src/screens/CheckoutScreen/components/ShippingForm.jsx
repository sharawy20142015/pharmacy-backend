// src/screens/CheckoutScreen/components/ShippingForm.jsx

import React from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const ShippingForm = ({
  styles,
  COLORS,
  addressData,
  setAddressData,
  locations,
  filteredCities,
  onGovernorateChange,
  onCityChange,
  isDesktop, // استقبال الـ Prop للتحكم في قلب الصفوف
}) => {
  // ستايل ديناميكي: يخليهم جنب بعض في الويب وتحت بعض في الموبايل بسلاسة
  const responsiveRowStyle = [
    styles.row,
    {
      flexDirection: isDesktop ? "row-reverse" : "column",
      gap: isDesktop ? 16 : 12,
    },
  ];

  return (
    <View style={styles.leftSection}>
      {/* عنوان التوصيل */}
      <View style={styles.sectionHeader}>
        <Ionicons name="location-sharp" size={22} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>عنوان التوصيل</Text>
      </View>

      {/* الحاوية المرنة */}
      <View style={{ gap: 16 }}>
        {/* صف الأسماء (Responsive) */}
        <View style={responsiveRowStyle}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>الاسم الأول</Text>
            <TextInput
              style={styles.input}
              placeholder="أدخل اسمك الأول"
              value={addressData.firstName}
              onChangeText={(t) =>
                setAddressData({ ...addressData, firstName: t })
              }
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>الاسم الأخير</Text>
            <TextInput
              style={styles.input}
              placeholder="أدخل اسمك الأخير"
              value={addressData.lastName}
              onChangeText={(t) =>
                setAddressData({ ...addressData, lastName: t })
              }
            />
          </View>
        </View>

        {/* صف اختيار المحافظة والمدينة (Responsive) */}
        <View style={responsiveRowStyle}>
          {/* المحافظة */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>المحافظة</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={addressData.governorate}
                onValueChange={onGovernorateChange}
                style={[styles.picker, { textAlign: "right" }]}
                dropdownIconColor={COLORS.primary}
                itemStyle={{ textAlign: "right", fontSize: 15 }}
              >
                <Picker.Item
                  label="إختر المحافظة"
                  value=""
                  color="#94a3b8"
                  style={{ textAlign: "right" }}
                />
                {locations.map((gov) => (
                  <Picker.Item
                    key={gov.id}
                    label={gov.name_ar}
                    value={gov.id}
                    style={{ textAlign: "right" }}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* المدينة / المنطقة */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>المدينة / المنطقة</Text>
            <View
              style={[
                styles.pickerWrapper,
                !addressData.governorate && styles.disabledPicker,
              ]}
            >
              <Picker
                selectedValue={addressData.city}
                onValueChange={onCityChange}
                style={[styles.picker, { textAlign: "right" }]}
                dropdownIconColor={COLORS.primary}
                itemStyle={{ textAlign: "right", fontSize: 15 }}
              >
                <Picker.Item
                  label={
                    filteredCities.length > 0
                      ? "إختر المدينة"
                      : "برجاء اختيار محافظة أولاً"
                  }
                  value=""
                  color="#94a3b8"
                  style={{ textAlign: "right" }}
                />
                {filteredCities.map((city) => (
                  <Picker.Item
                    key={city.id}
                    label={city.name_ar}
                    value={city.id}
                    style={{ textAlign: "right" }}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* العنوان بالتفصيل */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>العنوان بالتفصيل</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="أدخل العنوان بالتفصيل هنا (رقم المبنى، الشارع، المعالم المميزة)..."
            value={addressData.details}
            onChangeText={(t) => setAddressData({ ...addressData, details: t })}
          />
        </View>

        {/* رقم الموبايل */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>رقم الموبايل</Text>
          <View style={styles.phoneInputRow}>
            <TextInput
              style={[
                styles.input,
                {
                  flex: 1,
                  textAlign: "left",
                  borderWidth: 0,
                  backgroundColor: "transparent",
                },
              ]}
              keyboardType="phone-pad"
              placeholder="5xxxxxxxx"
              value={addressData.phone}
              onChangeText={(t) => setAddressData({ ...addressData, phone: t })}
            />
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+20</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShippingForm;
