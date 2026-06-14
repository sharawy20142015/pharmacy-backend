// src/screens/hook/useHomeData.js

import { useState, useEffect, useCallback } from "react";
import apiClient from "../../services/apiClient";

export const useHomeData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  const fetchAllHomeData = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setIsLoading(true);
      }

      // 👇 التعديل هنا: تم تصحيح الروابط لتطابق الـ Backend
      const [bannersRes, categoriesRes, newArrivalsRes, bestSellersRes] =
        await Promise.all([
          apiClient.get("/banners/").catch((err) => {
            console.log("Banners Error:", err.message);
            return { data: [] };
          }),
          apiClient.get("/categories/level-1").catch((err) => {
            console.log("Categories Error:", err.message);
            return { data: [] };
          }),
          apiClient
            .get("/classifications/products?type=New Arrivals&limit=10")
            .catch((err) => {
              console.log("New Arrivals Error:", err.message);
              return { data: [] };
            }),
          apiClient
            .get("/classifications/products?type=Best Sellers&limit=10")
            .catch((err) => {
              console.log("Best Sellers Error:", err.message);
              return { data: [] };
            }),
        ]);

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

  useEffect(() => {
    fetchAllHomeData();
  }, [fetchAllHomeData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllHomeData(true);
  }, [fetchAllHomeData]);

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
