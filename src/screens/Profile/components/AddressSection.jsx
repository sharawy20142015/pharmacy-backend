import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../ProfileStyles";
import apiClient from "../../../services/apiClient";

const AddressSection = ({
  isEditingAddress,
  setIsEditingAddress,
  addressForm,
  setAddressForm,
  handleSaveAddress,
  isSavingAddress,
  isLargeScreen,
}) => {
  const [locations, setLocations] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await apiClient.get("/shipping/locations");
        setLocations(res.data);
        if (addressForm.governorate) {
          const selectedGov = res.data.find(
            (g) =>
              g.name_ar === addressForm.governorate ||
              String(g.id) === String(addressForm.governorate),
          );
          if (selectedGov) setFilteredCities(selectedGov.cities);
        }
      } catch (err) {}
    };
    if (isEditingAddress) fetchLocations();
  }, [isEditingAddress]);

  const onGovChange = (govId) => {
    const selectedGov = locations.find((g) => String(g.id) === String(govId));
    setAddressForm({
      ...addressForm,
      governorate: selectedGov ? selectedGov.name_ar : "",
      city: "",
    });
    setFilteredCities(selectedGov ? selectedGov.cities : []);
  };

  const onCityChange = (cityId) => {
    const selectedCity = filteredCities.find(
      (c) => String(c.id) === String(cityId),
    );
    setAddressForm({
      ...addressForm,
      city: selectedCity ? selectedCity.name_ar : "",
    });
  };

  // 🟢 ستايلات مخصصة لضمان عدم تشوه المكون نهائياً
  const localStyles = {
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: COLORS.slate200,
      ...Platform.select({
        web: { boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.04)" },
        android: { elevation: 3 },
      }),
    },
    header: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    titleRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
    titleText: {
      fontFamily: "Tajawal_700Bold",
      fontSize: 16,
      color: COLORS.slate900,
    },
    editText: {
      fontFamily: "Tajawal_700Bold",
      fontSize: 14,
      color: COLORS.secondary,
    },
    label: {
      fontFamily: "Tajawal_700Bold",
      fontSize: 13,
      color: COLORS.slate700,
      marginBottom: 8,
      textAlign: "right",
    },
    inputBox: {
      backgroundColor: COLORS.slate50,
      borderWidth: 1,
      borderColor: COLORS.slate200,
      borderRadius: 12,
      height: 52,
      paddingHorizontal: 16,
      fontFamily: "Tajawal_500Medium",
      fontSize: 14,
      color: COLORS.slate900,
      textAlign: "right",
      ...Platform.select({ web: { outlineStyle: "none" } }),
    },
    textArea: { height: 100, paddingVertical: 16, textAlignVertical: "top" },
    pickerContainer: {
      backgroundColor: COLORS.slate50,
      borderWidth: 1,
      borderColor: COLORS.slate200,
      borderRadius: 12,
      height: 52,
      justifyContent: "center",
      overflow: "hidden",
    },
    picker: {
      width: "100%",
      height: "100%",
      backgroundColor: "transparent",
      borderWidth: 0,
      color: COLORS.slate900,
      fontFamily: "Tajawal_500Medium",
      fontSize: 14,
      paddingHorizontal: 12,
      direction: "rtl",
      ...Platform.select({ web: { outlineStyle: "none", cursor: "pointer" } }),
    },
    btnRow: { flexDirection: "row-reverse", gap: 12, marginTop: 10 },
    saveBtn: {
      flex: 2,
      backgroundColor: COLORS.primary,
      height: 52,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    cancelBtn: {
      flex: 1,
      backgroundColor: COLORS.slate100,
      height: 52,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    btnTextWhite: {
      fontFamily: "Tajawal_700Bold",
      color: COLORS.white,
      fontSize: 15,
    },
    btnTextGray: {
      fontFamily: "Tajawal_700Bold",
      color: COLORS.slate700,
      fontSize: 15,
    },
    displayBox: {
      backgroundColor: COLORS.slate50,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.slate200,
    },
    displayMainText: {
      fontFamily: "Tajawal_700Bold",
      fontSize: 15,
      color: COLORS.slate900,
      textAlign: "right",
      marginBottom: 4,
    },
    displaySubText: {
      fontFamily: "Tajawal_400Regular",
      fontSize: 14,
      color: COLORS.slate600,
      textAlign: "right",
      lineHeight: 22,
    },
  };

  return (
    <View style={localStyles.card}>
      <View style={localStyles.header}>
        <View style={localStyles.titleRow}>
          <MaterialIcons name="location-on" size={22} color={COLORS.primary} />
          <Text style={localStyles.titleText}>عنوان التوصيل الافتراضي</Text>
        </View>
        {!isEditingAddress && (
          <TouchableOpacity onPress={() => setIsEditingAddress(true)}>
            <Text style={localStyles.editText}>تعديل</Text>
          </TouchableOpacity>
        )}
      </View>

      {isEditingAddress ? (
        <View style={{ gap: 16 }}>
          <View
            style={{
              flexDirection: isLargeScreen ? "row-reverse" : "column",
              gap: 16,
            }}
          >
            {/* المحافظة */}
            <View style={{ flex: 1 }}>
              <Text style={localStyles.label}>المحافظة</Text>
              <View style={localStyles.pickerContainer}>
                <Picker
                  selectedValue={
                    locations.find((g) => g.name_ar === addressForm.governorate)
                      ?.id || ""
                  }
                  onValueChange={onGovChange}
                  style={localStyles.picker}
                >
                  <Picker.Item
                    label="اختر المحافظة..."
                    value=""
                    color={COLORS.slate400}
                  />
                  {locations.map((gov) => (
                    <Picker.Item
                      key={gov.id}
                      label={gov.name_ar}
                      value={gov.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* المدينة */}
            <View
              style={{ flex: 1, opacity: !addressForm.governorate ? 0.5 : 1 }}
            >
              <Text style={localStyles.label}>المدينة / المنطقة</Text>
              <View style={localStyles.pickerContainer}>
                <Picker
                  selectedValue={
                    filteredCities.find((c) => c.name_ar === addressForm.city)
                      ?.id || ""
                  }
                  onValueChange={onCityChange}
                  enabled={filteredCities.length > 0}
                  style={localStyles.picker}
                >
                  <Picker.Item
                    label={
                      filteredCities.length > 0
                        ? "اختر المدينة..."
                        : "اختر محافظة أولاً"
                    }
                    value=""
                    color={COLORS.slate400}
                  />
                  {filteredCities.map((city) => (
                    <Picker.Item
                      key={city.id}
                      label={city.name_ar}
                      value={city.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* الهاتف */}
          <View>
            <Text style={localStyles.label}>رقم الموبايل للتواصل</Text>
            <TextInput
              style={[localStyles.inputBox, { textAlign: "left" }]}
              placeholder="01xxxxxxxxx"
              placeholderTextColor={COLORS.slate400}
              keyboardType="phone-pad"
              value={addressForm.phone}
              onChangeText={(t) => setAddressForm({ ...addressForm, phone: t })}
            />
          </View>

          {/* التفاصيل */}
          <View>
            <Text style={localStyles.label}>العنوان بالتفصيل</Text>
            <TextInput
              style={[localStyles.inputBox, localStyles.textArea]}
              placeholder="اسم الشارع، رقم العمارة، الدور، الشقة..."
              placeholderTextColor={COLORS.slate400}
              multiline
              value={addressForm.details}
              onChangeText={(t) =>
                setAddressForm({ ...addressForm, details: t })
              }
            />
          </View>

          {/* أزرار الحفظ والإلغاء (تم إصلاحها بالكامل) */}
          <View style={localStyles.btnRow}>
            <TouchableOpacity
              style={localStyles.saveBtn}
              onPress={handleSaveAddress}
              disabled={isSavingAddress}
            >
              {isSavingAddress ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={localStyles.btnTextWhite}>حفظ التعديلات</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={localStyles.cancelBtn}
              onPress={() => setIsEditingAddress(false)}
            >
              <Text style={localStyles.btnTextGray}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={localStyles.displayBox}>
          {addressForm.details ? (
            <>
              <Text style={localStyles.displayMainText}>
                {addressForm.governorate} - {addressForm.city}
              </Text>
              <Text style={localStyles.displaySubText}>
                {addressForm.details}
              </Text>
              <View
                style={{
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  marginTop: 8,
                  gap: 6,
                }}
              >
                <MaterialIcons name="phone" size={16} color={COLORS.slate500} />
                <Text
                  style={{
                    fontFamily: "Tajawal_500Medium",
                    color: COLORS.slate600,
                  }}
                >
                  {addressForm.phone}
                </Text>
              </View>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditingAddress(true)}
              style={{
                paddingVertical: 24,
                alignItems: "center",
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: COLORS.slate200,
                borderRadius: 16,
              }}
            >
              <MaterialIcons
                name="add-location-alt"
                size={32}
                color={COLORS.slate400}
                style={{ marginBottom: 8 }}
              />
              <Text
                style={{
                  fontFamily: "Tajawal_700Bold",
                  color: COLORS.primary,
                  fontSize: 15,
                }}
              >
                أضف عنوان التوصيل الافتراضي
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default AddressSection;
