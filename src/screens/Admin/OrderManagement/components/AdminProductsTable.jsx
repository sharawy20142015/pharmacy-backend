import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal, // 👈 ضفنا المودال
  TextInput, // 👈 عشان الفورم
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { COLORS } from "../../../../theme/colors";
import { productService } from "../../../../services/productService";
import { styles } from "./AdminProductsTableStyles";

const AdminProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 State الخاصة بالـ Pop-up (المودال) والتعديل
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🌟 State الخاصة ببيانات الفورم اللي جوه المودال
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAllProducts({ limit: 100 });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🟢 دالة فتح المودال وتعبئة البيانات
  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    // بنملى الفورم بالبيانات الحالية للمنتج عشان الإدمن يلاقيها مكتوبة قدامه
    setEditForm({
      name: product.ar_name || product.en_name || "",
      price: product.final_price?.toString() || "0",
      quantity: product.quantity?.toString() || "0",
    });
    setEditModalVisible(true);
  };

  // 🟢 دالة حفظ التعديلات
  const handleSaveEdit = () => {
    // هنا هتبعت الريكويست للباك إند للتعديل
    console.log(
      "تم تعديل المنتج ID:",
      selectedProduct.id,
      "بالبيانات:",
      editForm,
    );

    // تعديل المنتج في الجدول قدام الإدمن فوراً (عشان يحس بالسرعة)
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...p,
              ar_name: editForm.name,
              final_price: parseFloat(editForm.price),
              quantity: parseInt(editForm.quantity),
            }
          : p,
      ),
    );

    // نقفل المودال
    setEditModalVisible(false);
    Alert.alert("نجاح", "تم تعديل بيانات المنتج بنجاح!");
  };

  const handleDelete = (productId) => {
    Alert.alert("تأكيد الحذف", "هل أنت متأكد أنك تريد حذف هذا المنتج؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: () => {
          // هنا هتحط API الحذف
          setProducts((prev) => prev.filter((p) => p.id !== productId));
        },
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerText, { width: 60 }]}>ID</Text>
      <Text style={[styles.headerText, { width: 70 }]}>الصورة</Text>
      <Text style={[styles.headerText, { width: 230 }]}>اسم المنتج</Text>
      <Text style={[styles.headerText, { width: 90 }]}>السعر</Text>
      <Text style={[styles.headerText, { width: 70 }]}>الكمية</Text>
      <Text style={[styles.headerText, { width: 120 }]}>الماركة</Text>
      <Text style={[styles.headerText, { width: 110 }]}>الفئة</Text>
      <Text style={[styles.headerText, { width: 100, textAlign: "center" }]}>
        الإجراءات
      </Text>
    </View>
  );

  const renderRow = ({ item, index }) => (
    // ضفنا لون مختلف للصفوف الزوجية عشان شكل الجدول يبقى أريح للعين
    <View style={[styles.tableRow, index % 2 === 0 && styles.rowEven]}>
      <Text style={[styles.cellText, { width: 60 }]}>{item.id}</Text>
      <View style={[styles.cellImageContainer, { width: 70 }]}>
        <Image
          source={{ uri: item.displayImage }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <Text
        style={[styles.cellText, styles.productName, { width: 230 }]}
        numberOfLines={2}
      >
        {item.ar_name || item.en_name || "بدون اسم"}
      </Text>
      <Text style={[styles.cellText, { width: 90 }]}>
        {item.final_price} ج.م
      </Text>
      <Text style={[styles.cellText, { width: 70 }]}>{item.quantity}</Text>
      <Text style={[styles.cellText, { width: 120 }]} numberOfLines={1}>
        {item.Brand_Name || "---"}
      </Text>
      <Text style={[styles.cellText, { width: 110 }]} numberOfLines={1}>
        {item.category || "---"}
      </Text>
      <View style={[styles.actionsContainer, { width: 100 }]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editBtn]}
          onPress={() => handleOpenEdit(item)}
        >
          <Feather name="edit-2" size={18} color="#0284c7" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteBtn]}
          onPress={() => handleDelete(item.id)}
        >
          <Feather name="trash-2" size={18} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.tableWrapper}>
          {renderHeader()}
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRow}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* 🌟 الـ Modal بتاع التعديل 🌟 */}
      <Modal
        visible={isEditModalVisible}
        transparent={true} // عشان الخلفية تبقى شفافة ونشوف الصفحة وراها
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تعديل بيانات المنتج</Text>

            {/* حقل اسم المنتج */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>اسم المنتج</Text>
              <TextInput
                style={styles.inputField}
                value={editForm.name}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, name: text })
                }
              />
            </View>

            {/* حقل السعر */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>السعر (ج.م)</Text>
              <TextInput
                style={styles.inputField}
                value={editForm.price}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setEditForm({ ...editForm, price: text })
                }
              />
            </View>

            {/* حقل الكمية */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>الكمية المتاحة</Text>
              <TextInput
                style={styles.inputField}
                value={editForm.quantity}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setEditForm({ ...editForm, quantity: text })
                }
              />
            </View>

            {/* زراير الحفظ والإلغاء */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>إلغاء</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveBtnText}>حفظ التعديلات</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdminProductsTable;
