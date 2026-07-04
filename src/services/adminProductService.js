import apiClient from "./apiClient";

export const adminProductService = {
  addNewProduct: async (productData) => {
    try {
      const payload = {
        ...productData,
        price: parseFloat(productData.price) || 0,
        discount_percentage: parseFloat(productData.discount_percentage) || 0,
        discount_value: parseFloat(productData.discount_value) || 0,
        stock_quantity: parseFloat(productData.stock_quantity) || 0,
      };

      const response = await apiClient.post("/products/admin/add", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAdminOrders: async () => {
    try {
      const response = await apiClient.get("/orders/admin/all");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

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
      throw error;
    }
  },

  updateProduct: async (productId, updatedData) => {
    try {
      const response = await apiClient.put(
        `/products/admin/${productId}`,
        updatedData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await apiClient.delete(`/products/admin/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
