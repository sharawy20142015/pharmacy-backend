import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
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
  savedAddress,
  handleUseSavedAddress,
}) => {
  return (
    <View style={styles.leftSection}>
      {/* 🟢 عنوان التوصيل */}
      <View style={styles.sectionHeader}>
        <Ionicons name="location-sharp" size={22} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>عنوان التوصيل</Text>
      </View>

      {savedAddress && (
        <TouchableOpacity
          style={styles.useSavedBtn}
          onPress={handleUseSavedAddress}
        >
          <MaterialIcons name="assignment-ind" size={20} color="#10B981" />
          <Text style={styles.useSavedText}>استخدام بياناتي المسجلة</Text>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>الاسم الأول</Text>
            <TextInput
              style={styles.input}
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
              value={addressData.lastName}
              onChangeText={(t) =>
                setAddressData({ ...addressData, lastName: t })
              }
            />
          </View>
        </View>

        {/* 🟢 المحافظة - Async Select */}
        <Text style={styles.inputLabel}>المحافظة</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={addressData.governorate}
            onValueChange={onGovernorateChange}
            style={[styles.picker, { textAlign: "right" }]} // 🟢 محاذاة النص لليمين
            dropdownIconColor={COLORS.primary}
            itemStyle={{ textAlign: "right", fontSize: 15 }} // لـ iOS
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
                style={{ textAlign: "right" }} // 🟢 محاذاة كل عنصر
              />
            ))}
          </Picker>
        </View>

        {/* 🟢 المدينة - Async Select */}
        <Text style={[styles.inputLabel, { marginTop: 15 }]}>
          المدينة / المنطقة
        </Text>
        <View
          style={[
            styles.pickerWrapper,
            !addressData.governorate && styles.disabledPicker,
          ]}
        >
          <Picker
            selectedValue={addressData.city}
            onValueChange={onCityChange}
            style={[styles.picker, { textAlign: "right" }]} // 🟢 محاذاة النص لليمين
            dropdownIconColor={COLORS.primary}
            itemStyle={{ textAlign: "right", fontSize: 15 }} // لـ iOS
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
                style={{ textAlign: "right" }} // 🟢 محاذاة كل عنصر
              />
            ))}
          </Picker>
        </View>

        <Text style={[styles.inputLabel, { marginTop: 15 }]}>
          العنوان بالتفصيل
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="أدخل العنوان بالتفصيل هنا..."
          value={addressData.details}
          onChangeText={(t) => setAddressData({ ...addressData, details: t })}
        />

        <Text style={[styles.inputLabel, { marginTop: 15 }]}>رقم الموبايل</Text>
        <View style={styles.phoneInputRow}>
          <TextInput
            style={[styles.input, { flex: 1, textAlign: "left" }]}
            keyboardType="phone-pad"
            placeholder="01xxxxxxxxx"
            value={addressData.phone}
            onChangeText={(t) => setAddressData({ ...addressData, phone: t })}
          />
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+20</Text>
          </View>
        </View>
      </View>

      {/* 🟢 كارت طريقة الدفع */}
      <View style={styles.sectionHeader}>
        <Ionicons name="card" size={22} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>طريقة الدفع</Text>
      </View>
      <View style={styles.paymentCard}>
        <View style={styles.paymentInfo}>
          <FontAwesome5
            name="money-bill-wave"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.paymentText}>الدفع نقدًا عند الاستلام</Text>
        </View>
        <Ionicons name="checkmark-circle" size={26} color={COLORS.primary} />
      </View>
    </View>
  );
};

export default ShippingForm;
