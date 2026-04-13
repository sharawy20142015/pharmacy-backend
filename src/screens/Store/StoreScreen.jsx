import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  ScrollView,
} from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { Image } from "expo-image"; // 👈 استخدام expo-image للأداء والثبات
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
import { useLoading } from "../../context/LoadingContext";
import LoadingScreen from "../../components/UI/LoadingScreen/LoadingScreen";

// --- Product Card Component ---
const ProductCard = ({ item, cardWidth, navigation, isMobile }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);

  const handleCartAction = (e) => {
    e.stopPropagation(); // منع الانتقال للتفاصيل عند الضغط على زر السلة
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
      {/* حاوية الصورة - تم تحديد ارتفاع ثابت في الستايل */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.productImage}
          contentFit="contain" // 👈 يضمن عدم تمدد الصورة خارج الحدود
          transition={200}
          cachePolicy="memory-disk"
        />
        <View style={styles.stockBadge}>
          <Text style={styles.stockBadgeText}>IN STOCK</Text>
        </View>
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
          <View style={styles.mainPriceRow}>
            <Text style={styles.finalPrice}>
              {item.final_price?.toFixed(2)}
            </Text>
            <Text style={styles.currency}>EGP</Text>
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
              size={isMobile ? 18 : 22}
              color={isInCart ? "#ef4444" : "#fff"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const StoreScreen = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const flatListRef = useRef(null);
  const { showLoading, hideLoading, isGlobalLoading } = useLoading();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [products, setProducts] = useState([]);
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

  const isDesktop = width >= 1024;
  const isMobile = width < 768;
  const numColumns = isDesktop ? 3 : 2;
  const sidebarWidth = isDesktop ? 288 : 0;
  const availableWidth =
    Math.min(width, 1440) - (isDesktop ? 48 : 24) - sidebarWidth;
  const cardWidth =
    Math.floor(
      (availableWidth - (isDesktop ? 24 : 12) * (numColumns - 1)) / numColumns,
    ) - 5;

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
        console.error(error);
      }
    };
    fetchInitialData();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      showLoading();
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      let queryStr = `?limit=${ITEMS_PER_PAGE}&offset=${offset}`;
      if (searchQuery) queryStr += `&search=${encodeURIComponent(searchQuery)}`;
      if (activeCategorySlug)
        queryStr += `&category_slug=${encodeURIComponent(activeCategorySlug)}`;
      if (selectedBrands.length > 0)
        selectedBrands.forEach(
          (b) => (queryStr += `&brands=${encodeURIComponent(b)}`),
        );

      const response = await apiClient.get(`/products/${queryStr}`);
      const data = response.data.products || response.data;
      setProducts(data);
      setTotalProducts(response.data.total || data.length);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFirstLoad(false);
      hideLoading();
    }
  }, [activeCategorySlug, selectedBrands, currentPage, searchQuery]);

  useEffect(() => {
    fetchProducts();
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

  const ListHeader = () => (
    <View style={{ paddingTop: 5 }}>
      {!isDesktop && (
        <View style={{ marginBottom: 20, zIndex: 10 }}>
          <SearchBar
            onSearch={(t) => {
              setSearchQuery(t);
              setCurrentPage(1);
            }}
            initialValue={searchQuery}
          />
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
            <SearchBar
              onSearch={(t) => {
                setSearchQuery(t);
                setCurrentPage(1);
              }}
              initialValue={searchQuery}
            />
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
    </View>
  );

  if (isFirstLoad) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={{ flex: 1 }}>
        <View style={[styles.mainWrapper, { flex: 1 }]}>
          <View style={[styles.contentLayout, { flex: 1 }]}>
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
                  onClearFilters={() => {
                    setActiveCategoryName(null);
                    setSelectedBrands([]);
                    setCurrentPage(1);
                  }}
                  onApplyFilters={() =>
                    flatListRef.current?.scrollToOffset({
                      offset: 0,
                      animated: true,
                    })
                  }
                />
              </View>
            )}

            <FlatList
              ref={flatListRef}
              data={products}
              keyExtractor={(item) => item.id.toString()}
              numColumns={numColumns}
              key={numColumns}
              columnWrapperStyle={{
                gap: isDesktop ? 24 : 12,
                justifyContent: "flex-start",
              }}
              contentContainerStyle={{ paddingBottom: 40 }}
              ListHeaderComponent={ListHeader}
              ListFooterComponent={
                <View>
                  {products.length === 0 && !isGlobalLoading && (
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
              onClearFilters={() => {
                setActiveCategoryName(null);
                setSelectedBrands([]);
                setIsFilterModalOpen(false);
              }}
              onApplyFilters={() => setIsFilterModalOpen(false)}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default StoreScreen;
