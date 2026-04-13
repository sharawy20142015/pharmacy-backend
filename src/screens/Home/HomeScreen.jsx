import React, { useState, useEffect } from "react";
import { ScrollView, View, SafeAreaView, StatusBar } from "react-native";
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
import RequestProduct from "./components/RequestProduct/RequestProduct"; // 👈 تم إضافة الاستيراد هنا
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

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  // تأثير التحميل الوهمي عند فتح الصفحة (ثانيتين)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer); // تنظيف الذاكرة
  }, []);

  // إذا كانت الصفحة في حالة تحميل، اعرض شاشة اللوجو والسبينر
  if (isLoading) {
    return <LoadingScreen />;
  }

  // إذا انتهى التحميل، اعرض الواجهة الكاملة
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* شريط الساعة والبطارية */}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* الهيدر المتجاوب ثابت في الأعلى */}
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* الحاوية الرئيسية (بتلم المحتوى في الديسكتوب وتفرده في الموبايل) */}
        <View style={styles.container}>
          <SearchBar />
          <HeroBanner />

          {/* 👈 الكومبوننت الجديد تم إضافته تحت البانر مباشرة */}
          <RequestProduct />

          <ShopByCategory />
          {/* <TrustedBrands /> */}
          {/* <OffersSection /> */}
          <Cosmetics />
          <SkinCareSection />
          <NewArrivals />
          <BestSellers />
          <HealthTips />
          <Features />
        </View>

        {/* الفوتر بره الـ container عشان ياخد العرض الكامل للشاشة (Black Footer) */}
        <Footer />
      </ScrollView>

      {/* زرار الاستشارة العائم */}
      {/* <FloatingButton /> */}
    </SafeAreaView>
  );
};

export default HomeScreen;
