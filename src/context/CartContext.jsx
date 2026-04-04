import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // للتأكد من تحميل البيانات قبل البدء في الحفظ

  // 1. تحميل السلة من الذاكرة المحلية (AsyncStorage) عند تشغيل التطبيق
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("@cart_items");
        if (storedCart !== null) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("خطأ في تحميل السلة من الذاكرة:", error);
      } finally {
        setIsLoaded(true); // تم الانتهاء من التحميل
      }
    };
    loadCart();
  }, []);

  // 2. حفظ السلة في الذاكرة تلقائياً عند أي تغيير (إضافة، حذف، تعديل كمية)
  useEffect(() => {
    const saveCart = async () => {
      if (isLoaded) {
        try {
          await AsyncStorage.setItem("@cart_items", JSON.stringify(cartItems));
        } catch (error) {
          console.error("خطأ في حفظ السلة:", error);
        }
      }
    };
    saveCart();
  }, [cartItems, isLoaded]);

  // إضافة منتج جديد للسلة أو زيادة الكمية إذا كان موجوداً
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }

      // إضافة المنتج مع نسخ كافة خصائصه (بما في ذلك الصور)
      return [
        ...prevItems,
        {
          ...product,
          qty: 1,
          title: product.en_name || product.ar_name || product.title,
          desc: product.header || product.Brand_Name || product.desc,
          price: product.final_price || product.price,
        },
      ];
    });
  };

  // تحديث كمية منتج معين
  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item)),
    );
  };

  // حذف منتج معين من السلة
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ الدالة الجديدة: تفريغ السلة بالكامل (مهمة لصفحة Checkout)
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart, // تم تمرير الدالة هنا لتصبح متاحة في كل التطبيق
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook مخصص لاستخدام السلة بسهولة
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
