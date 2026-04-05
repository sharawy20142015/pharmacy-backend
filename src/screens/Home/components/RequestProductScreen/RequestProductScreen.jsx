import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { styles, COLORS } from "./RequestProductScreen.styles";
import ProductRequestsService from "../../../../services/ProductRequestsService";

// مكون الحقول الفرعي لمنع إعادة الريندر عند الكتابة
const CustomInput = ({
  label,
  iconName,
  iconFamily,
  isTextArea,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable,
  maxLength, // ضفنا الـ maxLength عشان نتحكم في عدد الأرقام
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const IconComponent =
    iconFamily === "FontAwesome5" ? FontAwesome5 : MaterialIcons;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          isTextArea && styles.textAreaWrapper,
        ]}
      >
        <IconComponent
          name={iconName}
          size={20}
          color={isFocused ? COLORS.primary : COLORS.slate500}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, isTextArea && styles.textArea]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.slate500}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={editable}
          multiline={isTextArea}
          numberOfLines={isTextArea ? 4 : 1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          underlineColorAndroid="transparent"
          maxLength={maxLength}
        />
      </View>
    </View>
  );
};

const RequestProductScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const maxWidth = isDesktop ? 600 : "100%";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    productDetails: "",
  });

  const handleTextChange = (field, value) => {
    // لو بنغير رقم التليفون، نخليه يقبل أرقام بس
    if (field === "phone") {
      const cleaned = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [field]: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validateEgyptianPhone = (phone) => {
    // Regex للتحقق من أرقام الموبايل في مصر
    // يبدأ بـ 01 وبعده (0 أو 1 أو 2 أو 5) وبعده 8 أرقام
    const regex = /^01[0125][0-9]{8}$/;
    return regex.test(phone);
  };

  const handleSubmit = async () => {
    // 1. التحقق من الحقول الفارغة
    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.productDetails
    ) {
      Alert.alert("بيانات ناقصة ⚠️", "يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    // 2. التحقق من صحة رقم التليفون (الشرط الجديد)
    if (!validateEgyptianPhone(formData.phone)) {
      Alert.alert(
        "رقم تليفون غير صحيح 📱",
        "يرجى إدخال رقم موبايل مصري صحيح مكون من 11 رقم (فودافون، اتصالات، أورانج، أو وي).",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        product_details: formData.productDetails,
      };

      const response = await ProductRequestsService.createRequest(payload);

      navigation.navigate("SuccessScreen", {
        orderNumber: response.order_number,
        type: "request",
      });

      setFormData({ name: "", phone: "", address: "", productDetails: "" });
    } catch (error) {
      console.error("❌ Request Error:", error);
      const errorMsg =
        typeof error === "string"
          ? error
          : error.detail || "حدث خطأ أثناء إرسال الطلب.";
      Alert.alert("عذراً", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="arrow-forward" size={26} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>طلب منتج غير متوفر</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.formContainer, { maxWidth }]}>
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                <FontAwesome5
                  name="box-open"
                  size={28}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.title}>ما الذي تبحث عنه؟</Text>
              <Text style={styles.subtitle}>
                اكتب تفاصيل المنتج الذي لم تجده، وسنقوم بالبحث عنه وتوفيره لك
                فوراً.
              </Text>
            </View>

            <CustomInput
              label="الاسم بالكامل"
              iconName="person-outline"
              placeholder="أدخل اسمك "
              value={formData.name}
              onChangeText={(text) => handleTextChange("name", text)}
              editable={!isSubmitting}
            />

            <CustomInput
              label="رقم الهاتف (للتواصل)"
              iconName="phone-enabled"
              placeholder="01015XXXXXX"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleTextChange("phone", text)}
              editable={!isSubmitting}
              maxLength={11} // تحديد الحد الأقصى بـ 11 رقم
            />

            <CustomInput
              label="العنوان بالتفصيل"
              iconName="location-on"
              placeholder="المحافظة، المدينة، اسم الشارع..."
              value={formData.address}
              onChangeText={(text) => handleTextChange("address", text)}
              editable={!isSubmitting}
            />

            <CustomInput
              label="تفاصيل المنتج المطلوب"
              iconName="medkit"
              iconFamily="FontAwesome5"
              placeholder="اسم الدواء، التركيز، الكمية..."
              isTextArea={true}
              value={formData.productDetails}
              onChangeText={(text) => handleTextChange("productDetails", text)}
              editable={!isSubmitting}
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.submitButtonText}>إرسال الطلب الآن</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RequestProductScreen;
