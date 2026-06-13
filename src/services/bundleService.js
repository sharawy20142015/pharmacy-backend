// src/services/bundleService.js

import apiClient from "./apiClient";

/**
 * جلب جميع الباقات النشطة لعرضها في الشاشة الرئيسية (Home Screen)
 * @returns {Promise<Array>} لستة الباقات النشطة من قاعدة البيانات
 */
export const getActiveBundles = async () => {
  try {
    const response = await apiClient.get("/bundles/");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error in getActiveBundles service:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * جلب تفاصيل باقة معينة بالـ Slug بتاعها لشاشة تفاصيل الباقة (PackageDetailsScreen)
 * @param {string} slug - المعرف النصي الفريد للباقة (مثل: pkg_maternity_01)
 * @returns {Promise<Object>} كائن يحتوي على تفاصيل الباقة والمنتجات الـ 6 اللي جواها بخصوماتهم
 */
export const getBundleBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/bundles/${slug}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error in getBundleBySlug service for (${slug}):`,
      error.response?.data || error.message,
    );
    throw error;
  }
};
