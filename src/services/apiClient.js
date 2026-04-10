import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * سحب الـ URL من ملفات الـ .env بناءً على وضع التشغيل
 * Expo هيقرأ .env.development في اللوكال
 * وهيقرأ .env.production لو حددت وضع الـ production
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// طباعة بسيطة في الكونسول للتأكد إن الـ IP اللي مسحوب صح (مفيدة جداً في الـ Debugging)
console.log("🚀 Connecting to Backend at:", BASE_URL);

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // زودنا التايم أوت لـ 15 ثانية عشان لو النت ضعيف عند العميل
});

// 1️⃣ Request Interceptor (تركيب التوكن أوتوماتيك في كل طلب)
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("❌ Auth Token Error:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2️⃣ Response Interceptor (التعامل مع الردود وحالات انتهاء الجلسة)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // لو السيرفر رد بـ 401 (غير مصرح به)
    if (error.response?.status === 401) {
      console.warn(
        "⚠️ Session expired or unauthorized. Redirecting to login...",
      );

      // هنا ممكن تمسح التوكن المنتهي أوتوماتيك
      await AsyncStorage.removeItem("userToken");

      // ملحوظة: لو عندك Navigation ممكن تبعت اليوزر لصفحة الـ Login هنا
    }

    console.error(
      "🔥 API Error Detail:",
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

export default apiClient;
