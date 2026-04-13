import apiClient from "./apiClient";

/**
 * خدمة إدارة المنتجات الخاصة بلوحة التحكم (Admin Panel)
 */
export const adminProductService = {
  /**
   * 1️⃣ إضافة منتج جديد
   * يرسل البيانات إلى جداول ShortItemNo و Product و ProductImage في خطوة واحدة
   * @param {Object} productData - كائن يحتوي على كافة بيانات المنتج
   */
  addNewProduct: async (productData) => {
    try {
      // تجهيز البيانات لضمان إرسال أرقام صحيحة (Data Sanitization)
      const payload = {
        ...productData,
        price: parseFloat(productData.price) || 0,
        discount_percentage: parseFloat(productData.discount_percentage) || 0,
        discount_value: parseFloat(productData.discount_value) || 0,
        stock_quantity: parseFloat(productData.stock_quantity) || 0,
      };

      console.log(
        "📤 Sending new product to admin API:",
        payload.short_item_no,
      );

      const response = await apiClient.post("/products/admin/add", payload);

      return response.data;
    } catch (error) {
      console.error(
        "❌ adminProductService [addNewProduct] Error:",
        error.response?.data?.detail || error.message,
      );
      throw error;
    }
  },

  /**
   * 2️⃣ جلب كل الطلبات (للإدمن فقط)
   */
  getAdminOrders: async () => {
    try {
      const response = await apiClient.get("/orders/admin/all");
      return response.data;
    } catch (error) {
      console.error(
        "❌ adminProductService [getAdminOrders] Error:",
        error.message,
      );
      throw error;
    }
  },

  /**
   * 3️⃣ تحديث حالة طلب معين
   */
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiClient.patch(
        `/orders/${orderId}/status`,
        null,
        {
          params: { status },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ adminProductService [updateOrderStatus] Error:`,
        error.message,
      );
      throw error;
    }
  },
};
