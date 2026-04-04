import apiClient from "./apiClient";

const BASE_URL = "http://10.100.16.30:8004";

export const productService = {
  // 1. دالة تنسيق روابط الصور لتشمل الـ Base URL
  formatImageUrl: (path) => {
    if (!path) return "https://placehold.co/400x400?text=No+Image+Available";

    if (path.startsWith("http")) return path;

    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  },

  // 2. جلب المنتجات حسب التصنيف (Dynamic Endpoint)
  getProductsByClassification: async (type, limit = 10) => {
    try {
      const response = await apiClient.get("/classifications/products", {
        params: { type, limit },
      });

      return response.data.map((product) => ({
        ...product,
        displayImage: productService.formatImageUrl(product.img_url1),
      }));
    } catch (error) {
      console.error(`Fetch Classification [${type}] Error:`, error.message);
      throw error;
    }
  },

  // 3. جلب جميع المنتجات (Store)
  getAllProducts: async (params = {}) => {
    try {
      const response = await apiClient.get("/products/", { params });

      const data = response.data.map((product) => ({
        ...product,
        images:
          product.images?.map((img) => productService.formatImageUrl(img)) ||
          [],
      }));

      return data;
    } catch (error) {
      console.error("Fetch All Products Error:", error.message);
      throw error;
    }
  },

  // 4. جلب تفاصيل منتج واحد بالـ ID
  getProductById: async (productId) => {
    try {
      if (!productId || productId === "undefined") {
        console.warn("productService: productId is missing!");
        return null;
      }

      const response = await apiClient.get(`/products/${productId}`);
      const data = response.data;

      if (data && data.item_details) {
        data.item_details.img_url = productService.formatImageUrl(
          data.item_details.img_url,
        );

        if (data.item_details.additional_images) {
          data.item_details.additional_images =
            data.item_details.additional_images.map((imgObj) => ({
              ...imgObj,
              img_url: productService.formatImageUrl(imgObj.img_url),
            }));
        }
      }

      return data;
    } catch (error) {
      console.error(
        `Fetch Product ${productId} Error:`,
        error.response?.status || error.message,
      );
      throw error;
    }
  },

  // 5. جلب المنتجات التابعة لقسم معين بالـ Slug (بدون Limit)
  getProductsByCategorySlug: async (slug, offset = 0) => {
    try {
      // شيلنا الـ limit بناءً على طلبك عشان الـ API يرجع كل المنتجات
      const response = await apiClient.get(`/categories/${slug}/products`, {
        params: { offset },
      });

      return response.data.map((product) => ({
        ...product,
        // معالجة رابط الصورة الأساسية
        displayImage: productService.formatImageUrl(product.img_url1),
      }));
    } catch (error) {
      console.error(`Fetch Category Products [${slug}] Error:`, error.message);
      throw error;
    }
  },

  // 6. جلب كل البراندات المتاحة للفلترة
  getActiveBrands: async () => {
    try {
      const response = await apiClient.get("/products/brands");
      return response.data;
    } catch (error) {
      console.error("Fetch Active Brands Error:", error.message);
      throw error;
    }
  },

  // --- دوال مساعدة (شغالة كـ اختصارات) ---

  getNewArrivals: (limit = 10) =>
    productService.getProductsByClassification("New Arrival", limit),

  getOffers: (limit = 10) =>
    productService.getProductsByClassification("Offer", limit),
};
