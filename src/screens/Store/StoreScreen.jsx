import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { styles } from "./StoreScreen.styles";
import Header from "../../components/UI/Header/Header";
import Footer from "../../components/UI/Footer/Footer";
import FilterSidebar from "./FilterSidebar";
import SearchBar from "../Home/components/SearchBar/SearchBar";
import apiClient from "../../services/apiClient";
import { useCart } from "../../context/CartContext";

// --- Product Card Component ---
const ProductCard = ({ item, cardWidth, navigation, isMobile }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);

  const handleCartAction = (e) => {
    e.stopPropagation();
    if (isInCart) {
      removeFromCart(item.id);
    } else {
      addToCart(item);
    }
  };

  const imageUri =
    item.images?.[0] || item.img_url1 || "https://via.placeholder.com/200";

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ProductDetails", { productId: item.id })
      }
      style={[styles.productCard, { width: cardWidth }]}
    >
      <View style={[styles.imageContainer, isMobile && { padding: 12 }]}>
        <Image
          source={{ uri: imageUri }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <View style={[styles.stockBadge, isMobile && { top: 8, left: 8 }]}>
          <Text style={[styles.stockBadgeText, isMobile && { fontSize: 8 }]}>
            IN STOCK
          </Text>
        </View>
      </View>

      <View style={[styles.infoContainer, isMobile && { padding: 12 }]}>
        <View style={styles.textStack}>
          <Text style={[styles.brandName, isMobile && { fontSize: 10 }]}>
            {item.Brand_Name || "GENERIC"}
          </Text>
          <Text
            style={[styles.enName, isMobile && { fontSize: 13 }]}
            numberOfLines={2}
          >
            {item.en_name}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <View style={styles.mainPriceRow}>
            <Text style={[styles.finalPrice, isMobile && { fontSize: 16 }]}>
              {item.final_price?.toFixed(2)}
            </Text>
            <Text style={[styles.currency, isMobile && { fontSize: 10 }]}>
              EGP
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.floatingAddBtn, isInCart && styles.floatingRemoveBtn]}
          onPress={handleCartAction}
        >
          <MaterialIcons
            name={isInCart ? "remove-shopping-cart" : "shopping-cart"}
            size={isMobile ? 18 : 22}
            color={isInCart ? "#ef4444" : "#fff"}
          />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

// --- Main Store Screen Component ---
const StoreScreen = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const scrollRef = useRef(null);

  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const [searchQuery, setSearchQuery] = useState("");
  const [allCategoriesData, setAllCategoriesData] = useState([]);
  const [availableCategoryNames, setAvailableCategoryNames] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  const [activeCategorySlug, setActiveCategorySlug] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Handle incoming params from other screens
  useFocusEffect(
    useCallback(() => {
      let shouldUpdate = false;

      if (route.params?.search !== undefined) {
        setSearchQuery(route.params.search);
        shouldUpdate = true;
      }

      if (route.params?.categorySlug) {
        setActiveCategorySlug(route.params.categorySlug);
        setActiveCategoryName(route.params.categoryName);
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        setCurrentPage(1);
        navigation.setParams({
          search: undefined,
          categorySlug: undefined,
          categoryName: undefined,
        });
      }
    }, [route.params]),
  );

  // Layout calculations
  const isDesktop = width >= 1024;
  const isMobile = width < 768;
  const numColumns = isDesktop ? 3 : 2;
  const sidebarWidth = isDesktop ? 288 : 0;
  const availableWidth =
    Math.min(width, 1440) -
    (isDesktop ? 48 : 24) -
    sidebarWidth -
    (isDesktop ? 40 : 0);
  const cardWidth =
    Math.floor(
      (availableWidth - (isDesktop ? 24 : 12) * (numColumns - 1)) / numColumns,
    ) - 2;

  // جلب الأقسام والبراندات مع بعض أول ما الشاشة تفتح
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catResponse = await apiClient.get("/categories/");
        setAllCategoriesData(catResponse.data);
        setAvailableCategoryNames(catResponse.data.map((c) => c.name));

        const brandResponse = await apiClient.get("/products/brands");
        setAvailableBrands(brandResponse.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;

      let queryStr = `?limit=${ITEMS_PER_PAGE}&offset=${offset}`;

      if (searchQuery) {
        queryStr += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (activeCategorySlug) {
        queryStr += `&category_slug=${encodeURIComponent(activeCategorySlug)}`;
      }
      if (selectedBrands.length > 0) {
        selectedBrands.forEach((brand) => {
          queryStr += `&brands=${encodeURIComponent(brand)}`;
        });
      }

      const response = await apiClient.get(`/products/${queryStr}`);

      const data = response.data.products || response.data;
      const total = response.data.total || data.length;

      setProducts(data);
      setTotalProducts(total);
    } catch (error) {
      console.error("Fetch Products Error:", error);
    } finally {
      setLoading(false);
    }
  }, [activeCategorySlug, selectedBrands, currentPage, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handlers
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

  const handleSearch = (text) => {
    setSearchQuery(text);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveCategoryName(null);
    setActiveCategorySlug(null);
    setSelectedBrands([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            currentPage === i && styles.activePageButton,
          ]}
          onPress={() => {
            setCurrentPage(i);
            scrollRef.current?.scrollTo({ y: 0, animated: true });
          }}
        >
          <Text
            style={[
              styles.pageButtonText,
              currentPage === i && styles.activePageButtonText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>,
      );
    }
    return <View style={styles.paginationRow}>{pages}</View>;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.mainWrapper,
            { paddingHorizontal: isDesktop ? 24 : 12 },
          ]}
        >
          {/* 🟢 التعديل الجوهري هنا: إضافة zIndex و elevation للـ Wrapper بتاع الموبايل */}
          {!isDesktop && (
            <View
              style={{
                marginBottom: 20,
                zIndex: 9999,
                elevation: 9999,
                position: "relative",
              }}
            >
              <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
            </View>
          )}

          <View style={styles.toolsRow}>
            <View style={styles.breadcrumb}>
              <Text style={styles.crumbText}>Home</Text>
              <MaterialIcons name="chevron-right" size={18} color="#94a3b8" />
              <Text style={styles.crumbActive}>
                {activeCategoryName || "All Products"}
              </Text>
            </View>

            <View style={styles.toolsActions}>
              {isDesktop && (
                <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
              )}
              {!isDesktop && (
                <TouchableOpacity
                  style={styles.mobileFilterBtn}
                  onPress={() => setIsFilterModalOpen(true)}
                >
                  <MaterialIcons name="tune" size={20} color="#0f172a" />
                  <Text style={styles.filterBtnText}>Filter</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={[styles.contentLayout, { gap: isDesktop ? 40 : 0 }]}>
            {isDesktop && (
              <View style={{ width: sidebarWidth }}>
                <FilterSidebar
                  categories={availableCategoryNames}
                  activeCategory={activeCategoryName}
                  onCategoryChange={handleCategoryChange}
                  brands={availableBrands}
                  selectedBrands={selectedBrands}
                  onToggleBrand={(b) => {
                    setCurrentPage(1);
                    setSelectedBrands((prev) =>
                      prev.includes(b)
                        ? prev.filter((x) => x !== b)
                        : [...prev, b],
                    );
                  }}
                  totalProductsCount={totalProducts}
                  onClearFilters={handleClearFilters}
                  onApplyFilters={() => {
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                  }}
                />
              </View>
            )}

            <View style={styles.gridContainer}>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#10b77f"
                  style={{ marginTop: 100 }}
                />
              ) : (
                <>
                  {products.length === 0 ? (
                    <View style={{ alignItems: "center", marginTop: 50 }}>
                      <MaterialIcons
                        name="search-off"
                        size={64}
                        color="#cbd5e1"
                      />
                      <Text style={{ marginTop: 16, color: "#64748b" }}>
                        No products found matching your search
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.grid, { gap: isDesktop ? 24 : 12 }]}>
                      {products.map((item) => (
                        <ProductCard
                          key={item.id}
                          item={item}
                          cardWidth={cardWidth}
                          navigation={navigation}
                          isMobile={isMobile}
                        />
                      ))}
                    </View>
                  )}
                  {renderPagination()}
                  <View style={styles.paginationSection}>
                    <Text style={styles.pageText}>
                      Showing {products.length} of {totalProducts} products
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
        <Footer />
      </ScrollView>

      {/* Mobile Filter Modal */}
      <Modal visible={isFilterModalOpen} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setIsFilterModalOpen(false)}>
              <MaterialIcons name="close" size={28} color="#0f172a" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ padding: 20 }}>
            <FilterSidebar
              categories={availableCategoryNames}
              activeCategory={activeCategoryName}
              onCategoryChange={handleCategoryChange}
              brands={availableBrands}
              selectedBrands={selectedBrands}
              onToggleBrand={(b) => {
                setCurrentPage(1);
                setSelectedBrands((prev) =>
                  prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b],
                );
              }}
              totalProductsCount={totalProducts}
              onClearFilters={handleClearFilters}
              onApplyFilters={() => setIsFilterModalOpen(false)}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default StoreScreen;
