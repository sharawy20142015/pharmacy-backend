import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { styles } from "./Home.styles";
import { COLORS } from "../../theme/colors";

// 1. استيراد شاشة التحميل (Loading Screen)
import LoadingScreen from "../../components/UI/LoadingScreen/LoadingScreen";

// 2. استيراد المكونات العامة (Global Components)
import Header from "../../components/UI/Header/Header";
import Footer from "../../components/UI/Footer/Footer";

// 3. استيراد سكاشن الصفحة الرئيسية (Home Sections)
import SearchBar from "./components/SearchBar/SearchBar";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import RequestProduct from "./components/RequestProduct/RequestProduct";
import ShopByCategory from "./components/ShopByCategory/ShopByCategory";
import OffersSection from "./components/OffersSection/OffersSection";
import NewArrivals from "./components/NewArrivals/NewArrivals";
import BestSellers from "./components/BestSellers/BestSellers";
import TrustedBrands from "./components/TrustedBrands/TrustedBrands";
import HealthTips from "./components/HealthTips/HealthTips";
import Features from "./components/Features/Features";
import FloatingButton from "./components/FloatingButton/FloatingButton";
import Cosmetics from "./components/Cosmetics/Cosmetics";
import SkinCareSection from "./components/SkinCare/SkinCareSection";

// 🟢 التأكد من استيراد apiClient بشكل صحيح
import apiClient from "../../services/apiClient";

const HomeScreen = () => {
  // حالة التحميل الرئيسية
  const [isLoading, setIsLoading] = useState(true);
  // 👈 حالة السحب للتحديث
  const [refreshing, setRefreshing] = useState(false);

  // حالات تخزين البيانات (State)
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  // دالة لجلب كل البيانات مرة واحدة
  const fetchAllHomeData = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setIsLoading(true);
      }

      // 🚀 تعديل مهم جداً: ضفنا .catch لكل طلب لوحده
      // كدة لو API واحد سقط، الباقي هيشتغل عادي جداً والصفحة مش هتبوظ
      const [bannersRes, categoriesRes, newArrivalsRes, bestSellersRes] =
        await Promise.all([
          apiClient.get("/banners/home").catch((err) => {
            console.log("Banners Error");
            return { data: [] };
          }),
          apiClient.get("/categories/level-1").catch((err) => {
            console.log("Categories Error");
            return { data: [] };
          }),
          apiClient.get("/products/new-arrivals").catch((err) => {
            console.log("New Arrivals Error");
            return { data: [] };
          }),
          apiClient.get("/products/best-sellers").catch((err) => {
            console.log("Best Sellers Error");
            return { data: [] };
          }),
        ]);

      // تخزين البيانات في الـ State
      setBanners(bannersRes.data || []);
      setCategories(categoriesRes.data || []);
      setNewArrivals(newArrivalsRes.data || []);
      setBestSellers(bestSellersRes.data || []);
    } catch (error) {
      console.log("❌ Error fetching home data:", error);
    } finally {
      // 🚀 أول ما كل الداتا توصل، شيل شاشة التحميل واقفل علامة التحديث
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllHomeData();
  }, []);

  // 👈 دالة تشغيل السحب للتحديث
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllHomeData(true);
  }, []);

  // إذا كانت الصفحة في حالة تحميل، اعرض شاشة اللوجو والسبينر
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* الهيدر المتجاوب ثابت في الأعلى */}
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        // 👈 ضفنا السحب للتحديث هنا
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]} // لون التحميل
          />
        }
      >
        {/* الحاوية الرئيسية */}
        <View style={styles.container}>
          <SearchBar />

          {/* تمرير الداتا للسكاشن */}
          <HeroBanner data={banners} />

          {/* الكومبوننت الخاص بطلب منتج ناقص */}
          <RequestProduct />

          <ShopByCategory data={categories} />

          <Cosmetics />
          <SkinCareSection />

          <NewArrivals data={newArrivals} />
          <BestSellers data={bestSellers} />

          <HealthTips />
          <Features />
        </View>

        {/* الفوتر */}
        <Footer />
      </ScrollView>

      {/* زرار الاستشارة العائم - قم بإلغاء الكومنت لتفعيله */}
      {/* <FloatingButton /> */}
    </SafeAreaView>
  );
};

export default HomeScreen;
