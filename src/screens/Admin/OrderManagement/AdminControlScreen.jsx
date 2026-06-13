import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";

import { COLORS } from "../../../theme/colors";
import { useAuth } from "../../../context/AuthContext";
import apiClient from "../../../services/apiClient";

// 🟢 استيراد الستايلات المفصولة
import { styles } from "./AdminControlStyles";

// 🟢 استيراد المكونات (Components)
import StatusTabs from "./components/StatusTabs";
import OrderCard from "./components/OrderCard";
import OrderDetailModal from "./components/OrderDetailModal";
import AddProductForm from "./components/AddProductForm"; // 👈 استيراد فورم إضافة المنتج الجديد
import AdminProductsTable from "./components/AdminProductsTable";

// --- إعدادات حالات الطلب ---
const STATUS_CONFIG = {
  all: {
    label: "الكل",
    color: COLORS.slate700,
    bg: COLORS.slate200,
    icon: "layers",
  },
  pending: {
    label: "قيد الانتظار",
    color: "#d97706",
    bg: "#fef3c7",
    icon: "clock",
  },
  processing: {
    label: "جاري التجهيز",
    color: COLORS.secondary,
    bg: "#e0f2fe",
    icon: "loader",
  },
  shipped: {
    label: "تم الشحن",
    color: "#7e22ce",
    bg: "#f3e8ff",
    icon: "truck",
  },
  delivered: {
    label: "تم التوصيل",
    color: COLORS.primary,
    bg: "#dcfce7",
    icon: "check-circle",
  },
  cancelled: {
    label: "ملغي",
    color: COLORS.red500,
    bg: "#fee2e2",
    icon: "x-circle",
  },
};

// --- التابات الأساسية للوحة التحكم ---
const ADMIN_TABS = [
  { id: "orders", label: "الطلبات", icon: "shopping-bag" },
  { id: "categories", label: "الفئات", icon: "grid" },
  { id: "products", label: "المنتجات", icon: "package" },
  { id: "add_product", label: "إضافة منتج", icon: "plus-circle" },
  { id: "customers", label: "العملاء", icon: "users" },
];

const AdminControlScreen = () => {
  const { logout, user } = useAuth();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 992;

  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/orders/admin/all");
      setOrders(response.data);
      applyFilter(activeFilter, response.data);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const applyFilter = (status, data = orders) => {
    setActiveFilter(status);
    setFilteredOrders(
      status === "all"
        ? data
        : data.filter(
            (order) => order.status.toLowerCase() === status.toLowerCase(),
          ),
    );
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await apiClient.patch(`/orders/${orderId}/status?status=${newStatus}`);
      const updatedOrders = orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o,
      );
      setOrders(updatedOrders);
      applyFilter(activeFilter, updatedOrders);
      setModalVisible(false);
    } catch (error) {
      alert("حدث خطأ أثناء تحديث حالة الطلب");
    }
  };

  const renderSidebar = () => (
    <View style={isLargeScreen ? styles.sidebarLarge : styles.sidebarSmall}>
      {isLargeScreen && (
        <View style={styles.sidebarHeader}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>ش</Text>
          </View>
          <Text style={styles.sidebarTitle}>لوحة الإدارة</Text>
        </View>
      )}
      <ScrollView
        horizontal={!isLargeScreen}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          !isLargeScreen && { paddingHorizontal: 16, gap: 10 }
        }
      >
        {ADMIN_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.navItem,
                isActive && styles.navItemActive,
                !isLargeScreen && styles.navItemSmall,
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Feather
                name={tab.icon}
                size={20}
                color={isActive ? COLORS.primary : COLORS.slate500}
              />
              <Text style={[styles.navText, isActive && styles.navTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {isLargeScreen && (
        <TouchableOpacity style={styles.logoutBtnSidebar} onPress={logout}>
          <MaterialIcons name="logout" size={20} color={COLORS.red500} />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderOrdersContent = () => (
    <View style={styles.tabContent}>
      <StatusTabs
        activeFilter={activeFilter}
        onSelectFilter={applyFilter}
        config={STATUS_CONFIG}
      />
      {isLoading && !isRefreshing ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => {
                setSelectedOrder(item);
                setModalVisible(true);
              }}
              statusConfig={STATUS_CONFIG}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                fetchOrders();
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={80} color={COLORS.slate200} />
              <Text style={styles.emptyText}>لا توجد طلبات هنا</Text>
            </View>
          }
        />
      )}
    </View>
  );

  const renderCategoriesContent = () => (
    <View style={styles.placeholderContainer}>
      <Feather name="grid" size={80} color={COLORS.slate200} />
      <Text style={styles.placeholderText}>
        سيتم إضافة إدارة الفئات هنا قريبًا
      </Text>
      <TouchableOpacity style={styles.addBtn}>
        <Feather name="plus" size={20} color={COLORS.white} />
        <Text style={styles.addBtnText}>إضافة فئة جديدة</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text style={styles.headerTitle}>
            {ADMIN_TABS.find((t) => t.id === activeTab)?.label}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text style={styles.adminName}>
            مرحباً، {user?.name || "مدير النظام"}
          </Text>
          {!isLargeScreen && (
            <TouchableOpacity onPress={logout} style={styles.logoutBtnHeader}>
              <MaterialIcons name="logout" size={20} color={COLORS.red500} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View
        style={[
          styles.mainLayout,
          { flexDirection: isLargeScreen ? "row-reverse" : "column" },
        ]}
      >
        {renderSidebar()}
        <View style={styles.contentArea}>
          {activeTab === "orders" && renderOrdersContent()}
          {activeTab === "categories" && renderCategoriesContent()}

          {/* 👈 هنا استخدمنا الكومبوننت الجديد وباصينا ليه isLargeScreen */}
          {activeTab === "add_product" && (
            <AddProductForm isLargeScreen={isLargeScreen} />
          )}

          {activeTab === "products" && (
            <View style={styles.placeholderContainer}>
              <AdminProductsTable />
            </View>
          )}
          {activeTab === "customers" && (
            <View style={styles.placeholderContainer}>
              <Text>إدارة العملاء</Text>
            </View>
          )}
        </View>
      </View>

      <OrderDetailModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        statusConfig={STATUS_CONFIG}
      />
    </SafeAreaView>
  );
};

export default AdminControlScreen;
