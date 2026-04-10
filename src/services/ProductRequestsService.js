import apiClient from "./apiClient";

/**
 * خدمة إدارة طلبات المنتجات الخاصة (Special Product Requests)
 * تتعامل مع الـ Endpoints الخاصة بالطلبات سواء للعميل أو للأدمن
 */
const ProductRequestsService = {
  /**
   * 1️⃣ إرسال طلب منتج جديد (يستخدم في تطبيق الموبايل للعملاء)
   * @param {Object} requestData - البيانات المطلوبة:
   * {
   * name: "اسم العميل",
   * phone: "رقم الهاتف",
   * address: "العنوان بالتفصيل",
   * product_details: "وصف المنتج المطلوب"
   * }
   */
  createRequest: async (requestData) => {
    try {
      // POST /requests/create
      const response = await apiClient.post("/requests/create", requestData);

      // الرد بيحتوي على بيانات الطلب ومنها الـ order_number (مثلاً: REQ-A1B2C)
      return response.data;
    } catch (error) {
      // سحب رسالة الخطأ من الباك إند أو استخدام الرسالة الافتراضية
      const errorMsg =
        error.response?.data?.detail || error.message || "فشل في إرسال الطلب";
      console.error("❌ Error in createRequest:", errorMsg);
      throw errorMsg;
    }
  },

  /**
   * 2️⃣ جلب كل طلبات المنتجات (يستخدم في لوحة تحكم الأدمن)
   * يعرض الطلبات مرتبة من الأحدث للأقدم
   */
  getAllRequests: async () => {
    try {
      // GET /requests/
      const response = await apiClient.get("/requests/");
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || error.message || "فشل في جلب الطلبات";
      console.error("❌ Error in getAllRequests:", errorMsg);
      throw errorMsg;
    }
  },

  /**
   * 3️⃣ تحديث حالة الطلب (يستخدم بواسطة الأدمن فقط)
   * @param {number} requestId - معرف الطلب الرقمي (ID)
   * @param {string} status - الحالة الجديدة (pending, processing, completed, cancelled)
   */
  updateRequestStatus: async (requestId, status) => {
    try {
      // PATCH /requests/{request_id}/status
      // بنبعت الحالة في الـ Body كـ JSON بناءً على طلب الـ FastAPI Schema
      const response = await apiClient.patch(`/requests/${requestId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        error.message ||
        "فشل في تحديث حالة الطلب";
      console.error("❌ Error in updateRequestStatus:", errorMsg);
      throw errorMsg;
    }
  },
};

export default ProductRequestsService;
