import apiClient from "./apiClient"; // تأكد من المسار الصحيح لملف apiClient اللي إنت لسه عامله

const ProductRequestsService = {
  /**
   * إرسال طلب منتج جديد (يستخدم في الموبايل)
   * @param {Object} requestData - { name, phone, address, product_details }
   */
  createRequest: async (requestData) => {
    try {
      const response = await apiClient.post("/requests/create", requestData);
      return response.data;
    } catch (error) {
      // الخطأ بيتم التعامل معه فعلياً في interceptor بس هنا بنرميه عشان الشاشة تحس بيه
      throw error.response?.data || error.message;
    }
  },

  /**
   * جلب كل طلبات المنتجات (يستخدم في لوحة التحكم - للأدمن)
   */
  getAllRequests: async () => {
    try {
      const response = await apiClient.get("/requests/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * تحديث حالة الطلب (للأدمن)
   * @param {number} requestId
   * @param {string} status - 'pending', 'processing', 'completed', 'cancelled'
   */
  updateRequestStatus: async (requestId, status) => {
    try {
      const response = await apiClient.patch(`/requests/${requestId}/status`, {
        status: status,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default ProductRequestsService;
