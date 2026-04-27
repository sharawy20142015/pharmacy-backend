import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "../../../../theme/colors";
import { styles } from "./AddProductStyles";
import { adminProductService } from "../../../../services/adminProductService";
import apiClient from "../../../../services/apiClient";

const generateAutoSKU = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `SKU-${randomDigits}`;
};

// مكون الإدخال المحدث: Label موجود - Placeholder محذوف
const CustomInput = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  multiline = false,
  width = "100%",
}) => (
  <View style={[styles.column, { width }]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      placeholder="" // تم حذف الـ Placeholder نهائياً
      keyboardType={keyboardType}
      multiline={multiline}
      value={String(value)}
      onChangeText={onChangeText}
    />
  </View>
);

const AddProductForm = ({ isLargeScreen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCatIds, setSelectedCatIds] = useState([]);

  const initialFormState = {
    short_item_no: generateAutoSKU(),
    ar_name: "",
    en_name: "",
    brand_name: "",
    description: "",
    dosage: "",
    usage_instructions: "",
    header: "",
    sub_header: "", // 👈 موجودة في الـ State
    price: "",
    discount_percentage: "0",
    discount_value: "0",
    stock_quantity: "0",
    classification: "",
    is_active: true,
    is_featured: false,
    is_new_arrival: false,
    main_image_url: "",
  };

  const [productForm, setProductForm] = useState(initialFormState);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/categories/all-names");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const updateForm = (key, value) => {
    setProductForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (id) => {
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAddProduct = async () => {
    if (!productForm.ar_name || !productForm.price) {
      Alert.alert("تنبيه", "يرجى إدخال اسم المنتج والسعر على الأقل");
      return;
    }
    try {
      setIsLoading(true);
      const finalData = { ...productForm, category_ids: selectedCatIds };
      const result = await adminProductService.addNewProduct(finalData);
      if (result.status === "success") {
        Alert.alert("تم بنجاح", "تمت إضافة المنتج بنجاح");
        setProductForm({
          ...initialFormState,
          short_item_no: generateAutoSKU(),
        });
        setSelectedCatIds([]);
      }
    } catch (error) {
      Alert.alert("خطأ", error.response?.data?.detail || "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  const colHalf = isLargeScreen ? "50%" : "100%";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 1. هوية المنتج */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>هوية المنتج</Text>

        <View style={styles.skuBadge}>
          <Feather name="hash" size={18} color="#1e40af" />
          <Text style={styles.skuText}>كود المنتج التلقائي:</Text>
          <Text style={[styles.skuText, { fontWeight: "bold" }]}>
            {productForm.short_item_no}
          </Text>
        </View>

        <View style={styles.row}>
          <CustomInput
            width={colHalf}
            label="اسم المنتج بالعربي *"
            value={productForm.ar_name}
            onChangeText={(t) => updateForm("ar_name", t)}
          />
          <CustomInput
            width={colHalf}
            label="الاسم بالإنجليزي"
            value={productForm.en_name}
            onChangeText={(t) => updateForm("en_name", t)}
          />
          <CustomInput
            width={colHalf}
            label="الماركة / البراند"
            value={productForm.brand_name}
            onChangeText={(t) => updateForm("brand_name", t)}
          />
          <CustomInput
            width={colHalf}
            label="تبع انهي قسم زي New Arrival / Best Sellers"
            value={productForm.classification}
            onChangeText={(t) => updateForm("classification", t)}
          />
        </View>
      </View>

      {/* 2. الأقسام */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>أقسام المتجر</Text>
        <View style={styles.row}>
          {categories.map((cat) => (
            <View
              key={cat.id}
              style={{ width: isLargeScreen ? "33.3%" : "50%", padding: 4 }}
            >
              <TouchableOpacity
                onPress={() => toggleCategory(cat.id)}
                style={[
                  styles.categoryItem,
                  selectedCatIds.includes(cat.id) &&
                    styles.categoryItemSelected,
                ]}
              >
                <MaterialCommunityIcons
                  name={
                    selectedCatIds.includes(cat.id)
                      ? "checkbox-marked-circle"
                      : "checkbox-blank-circle-outline"
                  }
                  size={22}
                  color={
                    selectedCatIds.includes(cat.id)
                      ? COLORS.primary
                      : COLORS.slate300
                  }
                />
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* 3. التسعير والخصومات */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>التسعير والمخزون</Text>
        <View style={styles.row}>
          <CustomInput
            width={colHalf}
            label="السعر الأساسي *"
            keyboardType="numeric"
            value={productForm.price}
            onChangeText={(t) => updateForm("price", t)}
          />
          <CustomInput
            width={colHalf}
            label="الكمية في المخزن"
            keyboardType="numeric"
            value={productForm.stock_quantity}
            onChangeText={(t) => updateForm("stock_quantity", t)}
          />
          <CustomInput
            width={colHalf}
            label="نسبة الخصم (%)"
            keyboardType="numeric"
            value={productForm.discount_percentage}
            onChangeText={(t) => updateForm("discount_percentage", t)}
          />
          <CustomInput
            width={colHalf}
            label="قيمة الخصم (مبلغ ثابت)"
            keyboardType="numeric"
            value={productForm.discount_value}
            onChangeText={(t) => updateForm("discount_value", t)}
          />
        </View>
      </View>

      {/* 4. الصور والوصف */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>بيانات إضافية</Text>

        {/* 👈 التعديل هنا: تغيير اسم الحقل وتفعيل الـ multiline */}
        <CustomInput
          label="روابط صور المنتج (افصل بينها بـ | )"
          multiline={true}
          value={productForm.main_image_url}
          onChangeText={(t) => updateForm("main_image_url", t)}
        />

        <CustomInput
          label="اسم المنتج (Header)"
          value={productForm.header}
          onChangeText={(t) => updateForm("header", t)}
        />
        <CustomInput
          label="وصف فرعي تحت الاسم (Sub Header)"
          value={productForm.sub_header}
          onChangeText={(t) => updateForm("sub_header", t)}
        />
        <CustomInput
          label="الجرعة"
          value={productForm.dosage}
          onChangeText={(t) => updateForm("dosage", t)}
        />
        <CustomInput
          label="طريقة الاستخدام"
          multiline
          value={productForm.usage_instructions}
          onChangeText={(t) => updateForm("usage_instructions", t)}
        />
        <CustomInput
          label="وصف المنتج التفصيلي"
          multiline
          value={productForm.description}
          onChangeText={(t) => updateForm("description", t)}
        />
      </View>

      {/* 5. الإعدادات */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>الإعدادات</Text>
        <View style={styles.switchRow}>
          <Text style={{ fontWeight: "600" }}>تفعيل المنتج في المتجر</Text>
          <Switch
            value={productForm.is_active}
            onValueChange={(v) => updateForm("is_active", v)}
            trackColor={{ true: COLORS.primary }}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={{ fontWeight: "600" }}>إظهار في المنتجات المميزة</Text>
          <Switch
            value={productForm.is_featured}
            onValueChange={(v) => updateForm("is_featured", v)}
            trackColor={{ true: COLORS.primary }}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={{ fontWeight: "600" }}>وضع تاغ "وصل حديثاً"</Text>
          <Switch
            value={productForm.is_new_arrival}
            onValueChange={(v) => updateForm("is_new_arrival", v)}
            trackColor={{ true: COLORS.primary }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleAddProduct}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Feather name="plus-circle" size={24} color="#fff" />
            <Text style={styles.submitBtnText}>
              إضافة المنتج لقاعدة البيانات
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddProductForm;
