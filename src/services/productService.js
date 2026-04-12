import apiClient from "./apiClient";

/**
 * سحب الـ URL من متغيرات البيئة لضمان عمل الصور في الـ Local والـ Production
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const productService = {
  // 1️⃣ دالة تنسيق روابط الصور لتشمل الـ Base URL أو روابط المواقع الخارجية
  formatImageUrl: (path) => {
    if (!path) return "https://placehold.co/400x400?text=No+Image+Available";

    // لو الصورة جاية لينك كامل (من ImgBB أو غيره) يرجعها زي ما هي
    if (path.startsWith("http")) return path;

    // تنظيف المسار وإضافة الـ Base URL للصور المخزنة محلياً على السيرفر
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  },

  // 2️⃣ جلب المنتجات حسب التصنيف (New Arrival / Offer)
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
      console.error(`❌ Fetch Classification [${type}] Error:`, error.message);
      throw error;
    }
  },

  // 3️⃣ جلب جميع المنتجات (Store) مع دعم الفلترة
  getAllProducts: async (params = {}) => {
    try {
      const response = await apiClient.get("/products/", { params });

      // معالجة لستة المنتجات اللي راجعة
      const data = response.data.products.map((product) => ({
        ...product,
        // معالجة الصور لو كانت مصفوفة أو صورة واحدة
        displayImage: productService.formatImageUrl(
          product.img_url1 || product.img_url,
        ),
        images:
          product.images?.map((img) => productService.formatImageUrl(img)) ||
          [],
      }));

      return data;
    } catch (error) {
      console.error("❌ Fetch All Products Error:", error.message);
      throw error;
    }
  },

  // 4️⃣ جلب تفاصيل منتج واحد بالـ ID (لصفحة الـ Product Details)
  getProductById: async (productId) => {
    try {
      if (!productId || productId === "undefined") {
        console.warn("⚠️ productService: productId is missing!");
        return null;
      }

      const response = await apiClient.get(`/products/${productId}`);
      const data = response.data;

      // تنسيق الصور داخل تفاصيل المنتج
      if (data && data.img_url1) {
        data.img_url1 = productService.formatImageUrl(data.img_url1);
      }

      return data;
    } catch (error) {
      console.error(
        `❌ Fetch Product ${productId} Error:`,
        error.response?.status || error.message,
      );
      throw error;
    }
  },

  // 5️⃣ جلب منتجات قسم معين بواسطة الـ Slug (للـ Category Screen)
  getProductsByCategorySlug: async (slug, offset = 0) => {
    try {
      const response = await apiClient.get(`/categories/${slug}/products`, {
        params: { offset },
      });

      return response.data.map((product) => ({
        ...product,
        displayImage: productService.formatImageUrl(product.img_url1),
      }));
    } catch (error) {
      console.error(
        `❌ Fetch Category Products [${slug}] Error:`,
        error.message,
      );
      throw error;
    }
  },

  // 6️⃣ جلب كل البراندات المتاحة (للفلترة)
  getActiveBrands: async () => {
    try {
      const response = await apiClient.get("/products/brands");
      return response.data;
    } catch (error) {
      console.error("❌ Fetch Active Brands Error:", error.message);
      throw error;
    }
  },

  // --- اختصارات مفيدة ---

  getNewArrivals: (limit = 10) =>
    productService.getProductsByClassification("New Arrivals", limit),

  getOffers: (limit = 10) =>
    productService.getProductsByClassification("Offer", limit),
};
