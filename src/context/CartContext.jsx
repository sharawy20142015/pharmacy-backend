import React, { createContext, useContext, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // 1. استخدام useQuery لتحميل السلة من AsyncStorage
  const { data: cartItems = [], isSuccess: isLoaded } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const storedCart = await AsyncStorage.getItem("@cart_items");
      return storedCart ? JSON.parse(storedCart) : [];
    },
  });

  // 2. استخدام useMutation لحفظ أي تعديل في السلة
  const { mutate: updateCart } = useMutation({
    mutationFn: async (newCartItems) => {
      await AsyncStorage.setItem("@cart_items", JSON.stringify(newCartItems));
      return newCartItems;
    },
    onMutate: async (newCartItems) => {
      // Optimistic Update: تحديث الكاش فوراً عشان الـ UI يتحدث بدون انتظار
      await queryClient.cancelQueries({ queryKey: ["cartItems"] });
      const previousCart = queryClient.getQueryData(["cartItems"]);
      queryClient.setQueryData(["cartItems"], newCartItems);
      return { previousCart };
    },
    onError: (err, newCartItems, context) => {
      // لو حصل خطأ في الحفظ، نرجع للداتا القديمة
      if (context?.previousCart) {
        queryClient.setQueryData(["cartItems"], context.previousCart);
      }
      console.error("خطأ في حفظ السلة:", err);
    },
    onSettled: () => {
      // التأكد من مزامنة البيانات في النهاية
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
  });

  // 3. استخدام useCallback لمنع إعادة إنشاء الدوال مع كل Render
  const addToCart = useCallback(
    (product) => {
      const existingItem = cartItems.find((item) => item.id === product.id);
      let newCart;

      if (existingItem) {
        newCart = cartItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      } else {
        newCart = [
          ...cartItems,
          {
            ...product,
            qty: 1,
            title: product.en_name || product.ar_name || product.title,
            desc: product.header || product.Brand_Name || product.desc,
            price: product.final_price || product.price,
          },
        ];
      }
      updateCart(newCart);
    },
    [cartItems, updateCart],
  );

  const updateQty = useCallback(
    (id, newQty) => {
      if (newQty < 1) return;
      const newCart = cartItems.map((item) =>
        item.id === id ? { ...item, qty: newQty } : item,
      );
      updateCart(newCart);
    },
    [cartItems, updateCart],
  );

  const removeFromCart = useCallback(
    (id) => {
      const newCart = cartItems.filter((item) => item.id !== id);
      updateCart(newCart);
    },
    [cartItems, updateCart],
  );

  const clearCart = useCallback(() => {
    updateCart([]);
  }, [updateCart]);

  // 4. استخدام useMemo لتمرير القيم للـ Provider
  // (هذا يمنع إعادة تصيير كل المكونات التي تستخدم الـ Context إلا إذا تغيرت هذه القيم فعلياً)
  const contextValue = useMemo(
    () => ({
      cartItems,
      isLoaded,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
    }),
    [cartItems, isLoaded, addToCart, updateQty, removeFromCart, clearCart],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
