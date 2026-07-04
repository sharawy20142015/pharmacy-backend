import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./StoreScreen.styles";
import { COLORS } from "../../theme/colors";
import Header from "../../components/UI/Header/Header";
import Footer from "../../components/UI/Footer/Footer";
import FilterSidebar from "./FilterSidebar";
import SearchBar from "../Home/components/SearchBar/SearchBar";
import LoadingScreen from "../../components/UI/LoadingScreen/LoadingScreen";
import { useCart } from "../../context/CartContext";
import { useStoreData } from "../hook/useStoreData";

const ProductCard = React.memo(({ item, cardWidth, navigation, isMobile }) => {
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
  const hasDiscount =
    item.price && item.final_price && item.price > item.final_price;
  const discountPercentage = hasDiscount
    ? Math.round(((item.price - item.final_price) / item.price) * 100)
    : 0;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ProductDetails", { productId: item.id })
      }
      style={[styles.productCard, { width: cardWidth }]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.productImage}
          contentFit="contain"
          transition={200}
          cachePolicy="memory-disk"
        />
        <View style={styles.stockBadge}>
          <Text style={styles.stockBadgeText}>IN STOCK</Text>
        </View>
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>-{discountPercentage}%</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.textStack}>
          <Text style={styles.brandName} numberOfLines={1}>
            {item.Brand_Name || "GENERIC"}
          </Text>
          <Text style={styles.enName} numberOfLines={2}>
            {item.en_name}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <View style={styles.priceColumn}>
            {hasDiscount && (
              <Text style={styles.oldPrice}>{item.price?.toFixed(2)} EGP</Text>
            )}
            <View style={styles.mainPriceRow}>
              <Text
                style={[styles.finalPrice, hasDiscount && { color: "#ef4444" }]}
              >
                {item.final_price?.toFixed(2)}
              </Text>
              <Text
                style={[styles.currency, hasDiscount && { color: "#ef4444" }]}
              >
                EGP
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.floatingAddBtn,
              isInCart && styles.floatingRemoveBtn,
            ]}
            onPress={handleCartAction}
          >
            <MaterialIcons
              name={isInCart ? "remove-shopping-cart" : "shopping-cart"}
              size={isMobile ? 14 : 18}
              color={isInCart ? "#ef4444" : "#fff"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
});

const StoreScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [height, setHeight] = useState(Dimensions.get("window").height);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      if (window.width !== width) setWidth(window.width);
      if (window.height !== height) setHeight(window.height);
    });
    return () => subscription?.remove();
  }, [width, height]);

  const {
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
    categoriesData,
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
  } = useStoreData(flatListRef);

  const handleSearchSubmit = useCallback(
    (text) => {
      setSearchQuery(text);
      setCurrentPage(1);
    },
    [setSearchQuery, setCurrentPage],
  );

  const isDesktop = width >= 1024;
  const isMobile = width < 768;
  const numColumns = isDesktop ? 3 : 2;
  const sidebarWidth = isDesktop ? 288 : 0;
  const mainPadding = 24;
  const contentGap = isDesktop ? 40 : 0;
  const columnGap = isDesktop ? 24 : 12;

  const availableWidth =
    Math.min(width, 1440) - mainPadding - sidebarWidth - contentGap;
  const cardWidth =
    Math.floor((availableWidth - columnGap * (numColumns - 1)) / numColumns) -
    2;

  const paginationComponent = useMemo(() => {
    if (totalPages <= 1) return null;

    let pages = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      endPage = Math.min(totalPages, 3);
    }
    if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            currentPage === i && styles.activePageButton,
          ]}
          onPress={() => handlePageChange(i)}
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

    return (
      <View style={styles.paginationRow}>
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === 1 && styles.disabledPageButton,
          ]}
          onPress={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <MaterialIcons
            name="chevron-left"
            size={22}
            color={currentPage === 1 ? "#cbd5e1" : "#64748b"}
          />
        </TouchableOpacity>

        {pages}

        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabledPageButton,
          ]}
          onPress={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
        >
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={currentPage === totalPages ? "#cbd5e1" : "#64748b"}
          />
        </TouchableOpacity>
      </View>
    );
  }, [totalPages, currentPage, handlePageChange]);

  if (isFirstLoad) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={{ flex: 1 }}>
        <View style={[styles.mainWrapper, { flex: 1, paddingVertical: 10 }]}>
          <View style={[styles.contentLayout, { flex: 1, zIndex: 1 }]}>
            {isDesktop && (
              <View style={{ width: sidebarWidth, maxHeight: height - 160 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  <FilterSidebar
                    categories={categoriesData}
                    activeCategory={activeCategorySlug}
                    onCategoryChange={handleCategoryChange}
                    brands={availableBrands}
                    selectedBrands={selectedBrands}
                    onToggleBrand={handleToggleBrand}
                    totalProductsCount={totalProducts}
                    onClearFilters={handleClearFilters}
                    onApplyFilters={handleApplyFilters}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    inStockOnly={inStockOnly}
                    setInStockOnly={setInStockOnly}
                    onSaleOnly={onSaleOnly}
                    setOnSaleOnly={setOnSaleOnly}
                    onClose={() => setIsFilterModalOpen(false)}
                  />
                </ScrollView>
              </View>
            )}
            <View style={{ flex: 1, minWidth: 0 }}>
              {isFetching && !isFirstLoad && (
                <View style={{ padding: 10, alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#10b77f" />
                </View>
              )}
              <FlatList
                ref={flatListRef}
                data={products}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                key={numColumns}
                columnWrapperStyle={{
                  gap: columnGap,
                  justifyContent: "flex-start",
                }}
                contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={Platform.OS !== "web"}
                style={[
                  { flex: 1 },
                  Platform.OS === "web" && { overscrollBehaviorY: "contain" },
                ]}
                ListHeaderComponentStyle={{ zIndex: 9999, elevation: 9999 }} // 👈 تم إضافة السطر السحري هنا لفك حصار غلاف الهيدر الافتراضي
                ListHeaderComponent={
                  <View
                    style={{
                      paddingBottom: 12,
                      backgroundColor: "#f6f8f7",
                      zIndex: 1000,
                      elevation: 1000,
                    }}
                  >
                    {!isDesktop && (
                      <View
                        style={{
                          marginBottom: 12,
                          paddingHorizontal: 4,
                          zIndex: 2000,
                          elevation: 2000,
                        }}
                      >
                        <SearchBar
                          onSearch={handleSearchSubmit}
                          initialValue={searchQuery}
                        />
                      </View>
                    )}
                    <View style={styles.toolsRow}>
                      <View style={styles.breadcrumb}>
                        <Text style={styles.crumbText}>Home</Text>
                        <MaterialIcons
                          name="chevron-right"
                          size={18}
                          color="#94a3b8"
                        />
                        <Text style={styles.crumbActive}>
                          {activeCategoryName
                            ? activeCategoryName
                            : selectedBrands?.length === 1
                              ? selectedBrands[0]
                              : selectedBrands?.length > 1
                                ? `All Products (${selectedBrands.length} Brands)`
                                : "All Products"}
                        </Text>
                      </View>

                      <View style={styles.toolsActions}>
                        {isDesktop && (
                          <SearchBar
                            onSearch={handleSearchSubmit}
                            initialValue={searchQuery}
                          />
                        )}
                        {!isDesktop && (
                          <TouchableOpacity
                            style={styles.mobileFilterBtn}
                            onPress={() => setIsFilterModalOpen(true)}
                          >
                            <MaterialIcons
                              name="tune"
                              size={20}
                              color="#0f172a"
                            />
                            <Text style={styles.filterBtnText}>Filter</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[COLORS.primary]}
                  />
                }
                ListFooterComponent={
                  <View>
                    {products.length === 0 && !isFetching && (
                      <View style={{ alignItems: "center", marginTop: 50 }}>
                        <MaterialIcons
                          name="search-off"
                          size={64}
                          color="#cbd5e1"
                        />
                        <Text style={{ marginTop: 16, color: "#64748b" }}>
                          No products found
                        </Text>
                      </View>
                    )}
                    {paginationComponent}
                    {products.length > 0 && (
                      <View style={styles.paginationSection}>
                        <Text style={styles.pageText}>
                          Showing {products.length} of {totalProducts} products
                        </Text>
                      </View>
                    )}
                    <Footer />
                  </View>
                }
                renderItem={({ item }) => (
                  <ProductCard
                    item={item}
                    cardWidth={cardWidth}
                    navigation={navigation}
                    isMobile={isMobile}
                  />
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </View>
      </View>

      <Modal visible={isFilterModalOpen} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <FilterSidebar
            categories={categoriesData}
            activeCategory={activeCategorySlug}
            onCategoryChange={handleCategoryChange}
            brands={availableBrands}
            selectedBrands={selectedBrands}
            onToggleBrand={handleToggleBrand}
            totalProductsCount={totalProducts}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onSaleOnly={onSaleOnly}
            setOnSaleOnly={setOnSaleOnly}
            onClose={() => setIsFilterModalOpen(false)}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default StoreScreen;
