import axios from "axios";
// لو شغال موبايل (React Native) استخدم AsyncStorage، لو ويب استخدم localStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// الـ IP بتاع الباك إند بتاعك
const BASE_URL = "http://10.100.16.30:8004";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // لو السيرفر ماردش بعد 10 ثواني يديك Error
});

// 1️⃣ Request Interceptor (بنركب التوكن قبل ما الريكويست يروح)
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // بنجيب التوكن من التخزين (لو شغال ويب بس، غيرها لـ localStorage.getItem('token'))
      const token = await AsyncStorage.getItem("userToken");

      if (token) {
        // بنضيف التوكن في الهيدر بتاع أي ريكويست طالع
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2️⃣ Response Interceptor (بنتعامل مع الرد اللي راجع من السيرفر)
apiClient.interceptors.response.use(
  (response) => {
    // لو الريكويست نجح، بنرجع الداتا علطول
    return response;
  },
  (error) => {
    console.error("API Error: ", error.response?.data || error.message);

    // لو السيرفر رد بـ 401 (يعني اليوزر مش مسجل دخول أو التوكن بتاعه انتهى)
    if (error.response?.status === 401) {
      console.log(
        "Unauthorized! You should logout the user or redirect to Login.",
      );
      // تقدر هنا تنادي على دالة تعمل Logout لليوزر أوتوماتيك
    }

    return Promise.reject(error);
  },
);

export default apiClient;
