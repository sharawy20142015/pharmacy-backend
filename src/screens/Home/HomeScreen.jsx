// src/screens/Home/HomeScreen.jsx

import React from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { styles } from "./Home.styles";
import { COLORS } from "../../theme/colors";

// 🚀 استيراد الـ Custom Hook من مكانه الجديد
import { useHomeData } from "../hook/useHomeData";

// استيراد المكونات العامة (Global Components)
import LoadingScreen from "../../components/UI/LoadingScreen/LoadingScreen";
import Header from "../../components/UI/Header/Header";
import Footer from "../../components/UI/Footer/Footer";

// استيراد سكاشن الصفحة الرئيسية (Home Sections)
import SearchBar from "./components/SearchBar/SearchBar";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import RequestProduct from "./components/RequestProduct/RequestProduct";
import Bundles from "./components/Bundles/Bundles"; // 🟢 استيراد سكشن الباقات الحصرية الجديد هنا
import ShopByCategory from "./components/ShopByCategory/ShopByCategory";
import Cosmetics from "./components/Cosmetics/Cosmetics";
import SkinCareSection from "./components/SkinCare/SkinCareSection";
import NewArrivals from "./components/NewArrivals/NewArrivals";
import BestSellers from "./components/BestSellers/BestSellers";
import HealthTips from "./components/HealthTips/HealthTips";
import Features from "./components/Features/Features";

const HomeScreen = () => {
  // سطر واحد سحرى بيجيبلك كل البيانات والتحكم من الـ Hook الأصلي
  const {
    isLoading,
    refreshing,
    banners,
    categories,
    newArrivals,
    bestSellers,
    onRefresh,
  } = useHomeData();

  // إذا كانت الصفحة بتعمل Fetch، اعرض شاشة الـ Loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* الهيدر الثابت */}
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        <View style={styles.container}>
          <SearchBar />

          {/* تمرير الداتا للسكاشن الفرعية */}
          <HeroBanner data={banners} />

          <RequestProduct />

          {/* 🟢 إدراج سكشن الباقات هنا قبل الـ ShopByCategory مباشرة */}
          <Bundles />

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
    </SafeAreaView>
  );
};

export default HomeScreen;
