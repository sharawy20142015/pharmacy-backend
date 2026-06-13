// src/screens/hook/useStoreData.js

import { useState, useEffect, useCallback } from "react";
import { useRoute } from "@react-navigation/native";
import apiClient from "../../services/apiClient";

export const useStoreData = (flatListRef) => {
  const route = useRoute();
  const ITEMS_PER_PAGE = 20;

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // 🟢 1. ضفنا حالة السحب للتحديث للستور
  const [refreshing, setRefreshing] = useState(false);

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [allCategoriesData, setAllCategoriesData] = useState([]);
  const [availableCategoryNames, setAvailableCategoryNames] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  const [activeCategorySlug, setActiveCategorySlug] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    let shouldResetPage = false;
    if (
      route.params?.search !== undefined &&
      route.params?.search !== searchQuery
    ) {
      setSearchQuery(route.params.search);
      shouldResetPage = true;
    }
    if (
      route.params?.categorySlug &&
      route.params?.categorySlug !== activeCategorySlug
    ) {
      setActiveCategorySlug(route.params.categorySlug);
      setActiveCategoryName(route.params.categoryName);
      shouldResetPage = true;
    }
    if (shouldResetPage) {
      setCurrentPage(1);
    }
  }, [route.params]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catResponse, brandResponse] = await Promise.all([
          apiClient.get("/categories/"),
          apiClient.get("/products/brands"),
        ]);
        setAllCategoriesData(catResponse.data);
        setAvailableCategoryNames(catResponse.data.map((c) => c.name));
        setAvailableBrands(brandResponse.data);
      } catch (error) {
        console.error("Initial Data Error:", error);
      }
    };
    fetchInitialData();
  }, []);

  // 🟢 2. عدلنا دالة جلب البيانات عشان تقبل باراميتر التحديث الخفيف
  const fetchProducts = useCallback(
    async (isPullToRefresh = false) => {
      try {
        if (isPullToRefresh) {
          setRefreshing(true);
        } else {
          setIsFetching(true);
        }

        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        let queryStr = `?limit=${ITEMS_PER_PAGE}&offset=${offset}`;

        if (searchQuery)
          queryStr += `&search=${encodeURIComponent(searchQuery)}`;
        if (activeCategorySlug)
          queryStr += `&category_slug=${encodeURIComponent(activeCategorySlug)}`;
        if (selectedBrands.length > 0) {
          selectedBrands.forEach(
            (b) => (queryStr += `&brands=${encodeURIComponent(b)}`),
          );
        }

        const response = await apiClient.get(`/products/${queryStr}`);
        const data = response.data.products || response.data;
        setProducts(data);
        setTotalProducts(response.data.total || data.length);
      } catch (error) {
        console.error("Fetch Products Error:", error);
      } finally {
        setIsFirstLoad(false);
        setIsFetching(false);
        setRefreshing(false); // 🟢 قفل علامة التحميل عند الانتهاء
      }
    },
    [activeCategorySlug, selectedBrands, currentPage, searchQuery],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 🟢 3. دالة السحب للتحديث للستور
  const onRefresh = useCallback(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  const handleCategoryChange = (catName) => {
    setCurrentPage(1);
    if (!catName) {
      setActiveCategoryName(null);
      setActiveCategorySlug(null);
    } else {
      setActiveCategoryName(catName);
      const matchedCat = allCategoriesData.find((c) => c.name === catName);
      setActiveCategorySlug(matchedCat ? matchedCat.slug : null);
    }
  };

  const handleToggleBrand = (brand) => {
    setCurrentPage(1);
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((x) => x !== brand) : [...prev, brand],
    );
  };

  const handleClearFilters = () => {
    setActiveCategoryName(null);
    setActiveCategorySlug(null);
    setSelectedBrands([]);
    setSearchQuery("");
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return {
    isFirstLoad,
    isFetching,
    refreshing, // 🟢 خرجناها للشاشة
    products,
    totalProducts,
    currentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    availableCategoryNames,
    availableBrands,
    activeCategoryName,
    selectedBrands,
    isFilterModalOpen,
    setIsFilterModalOpen,
    handleCategoryChange,
    handleToggleBrand,
    handleClearFilters,
    handleApplyFilters,
    handlePageChange,
    onRefresh, // 🟢 خرجناها للشاشة
  };
};
