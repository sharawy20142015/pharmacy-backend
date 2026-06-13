// src/screens/hook/useHomeData.js

import { useState, useEffect, useCallback } from "react";
import apiClient from "../../services/apiClient"; // خطوتين بس لورا وتبقى جوه الـ src 🚀

export const useHomeData = () => {
  // حالات تخزين البيانات والتحميل (States)
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  // دالة جلب كل البيانات من الـ APIs (مغلفة بـ useCallback للأداء المثالي)
  const fetchAllHomeData = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setIsLoading(true);
      }

      // تشغيل كل الـ APIs بالتوازي مع حماية كل API بـ .catch لوحده
      const [bannersRes, categoriesRes, newArrivalsRes, bestSellersRes] =
        await Promise.all([
          apiClient.get("/banners/home").catch((err) => {
            console.log("Banners Error:", err.message);
            return { data: [] };
          }),
          apiClient.get("/categories/level-1").catch((err) => {
            console.log("Categories Error:", err.message);
            return { data: [] };
          }),
          apiClient.get("/products/new-arrivals").catch((err) => {
            console.log("New Arrivals Error:", err.message);
            return { data: [] };
          }),
          apiClient.get("/products/best-sellers").catch((err) => {
            console.log("Best Sellers Error:", err.message);
            return { data: [] };
          }),
        ]);

      // حفظ البيانات في الـ State
      setBanners(bannersRes.data || []);
      setCategories(categoriesRes.data || []);
      setNewArrivals(newArrivalsRes.data || []);
      setBestSellers(bestSellersRes.data || []);
    } catch (error) {
      console.log("❌ Unexpected Error fetching home data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // تشغيل الدالة تلقائياً أول ما الشاشة تفتح
  useEffect(() => {
    fetchAllHomeData();
  }, [fetchAllHomeData]);

  // دالة السحب للتحديث (Pull to Refresh)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllHomeData(true);
  }, [fetchAllHomeData]);

  // بنخرج الداتا والـ Functions اللي الـ HomeScreen محتاجاها
  return {
    isLoading,
    refreshing,
    banners,
    categories,
    newArrivals,
    bestSellers,
    onRefresh,
  };
};
