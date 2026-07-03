import { useState, useEffect, useCallback } from "react";
import { useRoute } from "@react-navigation/native";
import apiClient from "../../services/apiClient";

export const useStoreData = (flatListRef) => {
  const route = useRoute();
  const ITEMS_PER_PAGE = 20;

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [allCategoriesData, setAllCategoriesData] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

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
    if (shouldResetPage) setCurrentPage(1);
  }, [route.params]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catResponse, brandResponse] = await Promise.all([
          apiClient.get("/categories/"),
          apiClient.get("/products/brands"),
        ]);
        setAllCategoriesData(catResponse.data);
        setAvailableBrands(brandResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInitialData();
  }, []);

  const fetchProducts = useCallback(
    async (isPullToRefresh = false) => {
      try {
        if (isPullToRefresh) setRefreshing(true);
        else setIsFetching(true);

        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        let queryStr = `?limit=${ITEMS_PER_PAGE}&offset=${offset}`;

        if (searchQuery)
          queryStr += `&search=${encodeURIComponent(searchQuery)}`;
        if (activeCategorySlug)
          queryStr += `&category_slug=${encodeURIComponent(activeCategorySlug)}`;

        if (selectedBrands.length > 0) {
          selectedBrands.forEach((b) => {
            queryStr += `&brands=${encodeURIComponent(b)}`;
          });
        }

        if (minPrice !== "") queryStr += `&min_price=${minPrice}`;
        if (maxPrice !== "") queryStr += `&max_price=${maxPrice}`;

        if (inStockOnly) queryStr += `&in_stock_only=true`;
        if (onSaleOnly) queryStr += `&on_sale_only=true`;

        const response = await apiClient.get(`/products/${queryStr}`);
        const data = response.data.products || response.data;
        setProducts(data);
        setTotalProducts(response.data.total || data.length);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFirstLoad(false);
        setIsFetching(false);
        setRefreshing(false);
      }
    },
    [
      activeCategorySlug,
      selectedBrands,
      currentPage,
      searchQuery,
      minPrice,
      maxPrice,
      inStockOnly,
      onSaleOnly,
    ],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = useCallback(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  const handleCategoryChange = (categorySlug) => {
    setCurrentPage(1);
    if (!categorySlug) {
      setActiveCategoryName(null);
      setActiveCategorySlug(null);
    } else {
      setActiveCategorySlug(categorySlug);
      const matchedCat = allCategoriesData.find((c) => c.slug === categorySlug);
      setActiveCategoryName(matchedCat ? matchedCat.name : null);
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
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setOnSaleOnly(false);
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    fetchProducts();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return {
    isFirstLoad,
    isFetching,
    refreshing,
    products,
    totalProducts,
    currentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    categoriesData: allCategoriesData,
    availableBrands,
    activeCategoryName,
    activeCategorySlug,
    selectedBrands,
    isFilterModalOpen,
    setIsFilterModalOpen,
    handleCategoryChange,
    handleToggleBrand,
    handleClearFilters,
    handleApplyFilters,
    handlePageChange,
    onRefresh,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    inStockOnly,
    setInStockOnly,
    onSaleOnly,
    setOnSaleOnly,
  };
};
