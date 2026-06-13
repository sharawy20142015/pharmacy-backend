// src/screens/PackageDetails/PackageDetailsScreen.jsx

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import { styles } from "./PackageDetailsScreen.styles";
import { COLORS } from "../../theme/colors";
import { useCart } from "../../context/CartContext";
import { useBundleDetails } from "../hook/useBundleDetails";

// استيراد المكونات الفرعية للشاشة
import PackageHero from "./components/PackageHero";
import PackageProductItem from "./components/PackageProductItem";
import PackageSummary from "./components/PackageSummary";

const PackageDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { addToCart } = useCart();

  // استقبال الـ slug المبعوت من الشاشة الرئيسية باسم bundleId
  const { bundleId } = route.params || {};

  const { bundle, loading, error } = useBundleDetails(bundleId);

  // حالة المنتجات المختارة (مصفوفة الـ short_item_no)
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // ستيت التحكم في ظهور رسالة التحذير الاحترافية للباقة
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMessage] = useState("");

  // أول ما الداتا تحمل، بنخلي كل المنتجات مختارة توماتيك كوضع افتراضي
  useEffect(() => {
    if (bundle && bundle.products) {
      setSelectedProductIds(bundle.products.map((p) => p.short_item_no));
    }
  }, [bundle]);

  const handleToggleProduct = useCallback((id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemIds) => itemIds !== id)
        : [...prev, id],
    );
  }, []);

  // حسبة مالية ديناميكية 100% تعتمد على أسعار المنتجات الحقيقية بداخل الباقة دائماً لمنع تضارب الـ 799 القديمة
  const totals = useMemo(() => {
    if (!bundle || !bundle.products)
      return { count: 0, priceBeforeDiscount: 0, discount: 0, finalTotal: 0 };

    const selectedItems = bundle.products.filter((p) =>
      selectedProductIds.includes(p.short_item_no),
    );

    const priceBeforeDiscount = selectedItems.reduce(
      (sum, p) => sum + Number(p.original_price || 0),
      0,
    );

    const finalTotal = selectedItems.reduce(
      (sum, p) => sum + Number(p.bundle_final_price || 0),
      0,
    );

    const discount = Math.max(0, priceBeforeDiscount - finalTotal);

    return {
      count: selectedItems.length,
      priceBeforeDiscount,
      discount,
      finalTotal,
    };
  }, [selectedProductIds, bundle]);

  // دالة إضافة الباقة الذكية إلى سلة المشتريات كـ حزمة واحدة مجمعة ومحمية
  const handleAddBundleToCart = () => {
    if (!bundle || !bundle.products) return;

    const selectedItems = bundle.products.filter((p) =>
      selectedProductIds.includes(p.short_item_no),
    );

    // 1️⃣ حماية الشرط التجاري: تأكيد اختيار منتجين على الأقل لمنع العميل من الاستفراد بخصم منتج واحد
    if (selectedItems.length < 2) {
      setAlertMessage(
        "برجاء اختيار منتجين على الأقل من مكونات الباقة لتتمكن من تفعيل الخصم الحصري وإضافتها للسلة الكلية.",
      );
      setAlertVisible(true);
      return;
    }

    // 2️⃣ التقفيل السحري: دمج المنتجات كـ عنصر أب (Parent Bundle Item) فريد داخل السلة لمنع تفكيكه في شاشة الـ Cart
    addToCart({
      id: `bundle_${bundle.slug}`,
      en_name: bundle.name_ar,
      final_price: Number(totals.finalTotal),
      qty: 1,
      images: [bundle.image_url || "https://via.placeholder.com/150"],
      isBundle: true,
      bundleProducts: selectedItems.map((p) => ({
        product_id: p.short_item_no,
        name: p.name_ar,
        quantity: p.quantity,
      })),
    });

    navigation.navigate("Cart");
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (error || !bundle) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center", padding: 20 },
        ]}
      >
        <MaterialIcons name="error-outline" size={48} color="red" />
        <Text
          style={{
            marginTop: 12,
            fontSize: 16,
            color: "#333",
            textAlign: "center",
          }}
        >
          {error || "عفواً، لم نتمكن من العثور على تفاصيل الباقة المطلوبة."}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: COLORS.primary,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff" }}>العودة للرئيسية</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* الهيدر العلوي */}
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <MaterialIcons
              name="arrow-forward"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{bundle.name_ar}</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* منطقة السكرول الآمنة والمحدثة */}
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.mainLayout,
            { flexDirection: isDesktop ? "row-reverse" : "column" },
          ]}
        >
          {/* عمود المنتجات الأيمن */}
          <View
            style={{
              width: isDesktop ? "65%" : "100%",
              flex: isDesktop ? 8 : undefined,
            }}
          >
            <PackageHero data={bundle} />

            <Text style={styles.sectionTitle}>مكونات الباقة</Text>

            {bundle.products.map((product) => (
              <PackageProductItem
                key={product.short_item_no}
                product={{
                  id: product.short_item_no,
                  name: product.name_ar || product.name_en,
                  desc: `كود الصنف: ${product.short_item_no} | الكمية داخل الباقة: ${product.quantity}`,
                  price: Number(product.bundle_final_price),
                  oldPrice:
                    Number(product.original_price) >
                    Number(product.bundle_final_price)
                      ? Number(product.original_price)
                      : null,
                  image: product.image,
                }}
                isSelected={selectedProductIds.includes(product.short_item_no)}
                onToggle={() => handleToggleProduct(product.short_item_no)}
              />
            ))}
          </View>

          {/* عمود ملخص الفاتورة الأيسر */}
          <View
            style={{
              width: isDesktop ? "35%" : "100%",
              flex: isDesktop ? 4 : undefined,
              marginRight: isDesktop ? 24 : 0,
            }}
          >
            <PackageSummary
              totals={totals}
              onAddToCart={handleAddBundleToCart}
              isDesktop={isDesktop}
            />
          </View>
        </View>
      </ScrollView>

      {/* الـ Pop-up التحذيري للحد الأدنى المربوط تماماً بملف الاستايلات الخارجي 🟢 */}
      <Modal
        visible={alertVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.alertIconContainer}>
              <MaterialIcons name="gpp-maybe" size={40} color="#b45309" />
            </View>
            <Text style={styles.modalTitle}>تنبيه الباقة الحصرية ⚠️</Text>
            <Text style={styles.modalMessage}>{alertMsg}</Text>
            <TouchableOpacity
              style={styles.alertActionBtn}
              onPress={() => setAlertVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.alertActionBtnText}>حسناً، فهمت</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PackageDetailsScreen;
