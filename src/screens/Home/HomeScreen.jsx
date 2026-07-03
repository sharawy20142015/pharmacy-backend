import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  StatusBar,
  RefreshControl,
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
import RequestProduct from "./components/RequestProduct/RequestProduct";
import Bundles from "./components/Bundles/Bundles";
import ShopByCategory from "./components/ShopByCategory/ShopByCategory";
import Cosmetics from "./components/Cosmetics/Cosmetics";
import SkinCareSection from "./components/SkinCare/SkinCareSection";
import NewArrivals from "./components/NewArrivals/NewArrivals";
import BestSellers from "./components/BestSellers/BestSellers";
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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

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
          <HeroBanner data={banners} />
          <RequestProduct />
          <Bundles />
          <ShopByCategory data={categories} />
          <Cosmetics />
          <SkinCareSection />
          <NewArrivals data={newArrivals} />
          <BestSellers data={bestSellers} />
          <HealthTips />
          <Features />
        </View>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
