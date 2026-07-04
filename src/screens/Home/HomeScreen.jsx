import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Platform,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { styles } from "./Home.styles";
import { COLORS } from "../../theme/colors";

import { useHomeData } from "../hook/useHomeData";

import LoadingScreen from "../../components/UI/LoadingScreen/LoadingScreen";
import Header from "../../components/UI/Header/Header";
import Footer from "../../components/UI/Footer/Footer";

import SearchBar from "./components/SearchBar/SearchBar";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import ShopByCategory from "./components/ShopByCategory/ShopByCategory";
import RequestProduct from "./components/RequestProduct/RequestProduct";
import NewArrivals from "./components/NewArrivals/NewArrivals";
import BestSellers from "./components/BestSellers/BestSellers";
import Cosmetics from "./components/Cosmetics/Cosmetics";
import SkinCareSection from "./components/SkinCare/SkinCareSection";
import Bundles from "./components/Bundles/Bundles";
import HealthTips from "./components/HealthTips/HealthTips";
import Features from "./components/Features/Features";

const HomeScreen = () => {
  const queryClient = useQueryClient();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const {
    isLoading,
    banners,
    categories,
    newArrivals,
    bestSellers,
    onRefresh: originalOnRefresh,
  } = useHomeData();

  const handleRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    if (originalOnRefresh) {
      await originalOnRefresh();
    }
    await queryClient.invalidateQueries();
    setIsManualRefreshing(false);
  }, [queryClient, originalOnRefresh]);

  if (isLoading && !isManualRefreshing) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundLight}
      />

      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isManualRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.container}>
          <SearchBar />

          <View style={styles.sectionGap}>
            <HeroBanner data={banners} />
          </View>

          <View style={styles.sectionGap}>
            <RequestProduct />
          </View>

          <Bundles />

          <View style={styles.sectionGap}>
            <ShopByCategory data={categories} />
          </View>

          <View style={styles.sectionGap}>
            <NewArrivals data={newArrivals} />
          </View>

          <View style={styles.sectionGap}>
            <BestSellers data={bestSellers} />
          </View>

          <View style={styles.sectionGap}>
            <Cosmetics />
            <SkinCareSection />
            <HealthTips />
          </View>

          <View style={styles.sectionGap}>
            <Features />
          </View>
        </View>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
