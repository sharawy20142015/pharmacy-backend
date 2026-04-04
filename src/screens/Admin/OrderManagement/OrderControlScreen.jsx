import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";

import { COLORS } from "../../../theme/colors";
import { useAuth } from "../../../context/AuthContext";
import apiClient from "../../../services/apiClient"; // تأكد من المسار الصحيح

import { styles } from "./OrderControlStyles";
import StatusTabs from "./components/StatusTabs";
import OrderCard from "./components/OrderCard";
import OrderDetailModal from "./components/OrderDetailModal";

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

const OrderControlScreen = () => {
  const { logout, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/orders/admin/all");
      const data = response.data;
      setOrders(data);
      applyFilter(activeFilter, data);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webWrapper}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>لوحة الطلبات 📦</Text>
            <Text style={styles.adminName}>
              مرحباً، {user?.name || "مدير النظام"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            style={styles.logoutBtn}
            activeOpacity={0.7}
          >
            <MaterialIcons name="logout" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <StatusTabs
          activeFilter={activeFilter}
          onSelectFilter={applyFilter}
          config={STATUS_CONFIG}
        />

        <View style={styles.content}>
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
                  onPress={() => openOrderModal(item)}
                  statusConfig={STATUS_CONFIG}
                />
              )}
              contentContainerStyle={styles.listPadding}
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

export default OrderControlScreen;
