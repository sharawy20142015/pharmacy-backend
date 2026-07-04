import apiClient from "./apiClient";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const productService = {
  formatImageUrl: (path) => {
    if (!path) return "https://placehold.co/400x400?text=No+Image+Available";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  },

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
      throw error;
    }
  },

  getAllProducts: async (params = {}) => {
    try {
      const response = await apiClient.get("/products/", { params });
      const data = response.data.products.map((product) => ({
        ...product,
        displayImage: productService.formatImageUrl(
          product.img_url1 || product.img_url,
        ),
        images:
          product.images?.map((img) => productService.formatImageUrl(img)) ||
          [],
      }));
      return data;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (productId) => {
    try {
      if (!productId || productId === "undefined") {
        return null;
      }
      const response = await apiClient.get(`/products/${productId}`);
      const data = response.data;
      let allImages = [];

      ["img_url1", "img_url2", "img_url3", "img_url4"].forEach((key) => {
        if (data[key]) {
          allImages.push(productService.formatImageUrl(data[key]));
        }
      });

      const extraImages = data.additional_images || data.images || [];
      if (Array.isArray(extraImages)) {
        extraImages.forEach((img) => {
          const imgPath =
            typeof img === "string"
              ? img
              : img.url || img.image_path || img.image_url || img;
          if (imgPath) {
            allImages.push(productService.formatImageUrl(imgPath));
          }
        });
      }

      data.images = [...new Set(allImages)].filter(Boolean);
      return data;
    } catch (error) {
      throw error;
    }
  },

  getRelatedProducts: async (productId, limit = 5) => {
    try {
      const response = await apiClient.get(`/products/${productId}/related`, {
        params: { limit },
      });
      return response.data.map((product) => ({
        ...product,
        displayImage: productService.formatImageUrl(
          product.img_url1 || product.img_url,
        ),
        images:
          product.images?.map((img) => productService.formatImageUrl(img)) ||
          [],
      }));
    } catch (error) {
      throw error;
    }
  },

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
      throw error;
    }
  },

  getActiveBrands: async () => {
    try {
      const response = await apiClient.get("/products/brands");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNewArrivals: (limit = 10) =>
    productService.getProductsByClassification("New Arrivals", limit),

  getOffers: (limit = 10) =>
    productService.getProductsByClassification("Offer", limit),
};
