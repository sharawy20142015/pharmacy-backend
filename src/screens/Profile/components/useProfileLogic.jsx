import { useState, useCallback } from "react";
import { Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import apiClient from "../../../services/apiClient";
import { loyaltyService } from "../../../services/loyaltyService";
// ✅ استيراد useAuth لاستخدام الحالة المركزية
import { useAuth } from "../../../context/AuthContext";

const useProfileLogic = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth(); // ✅ جلب الـ user والـ logout من الـ Context

  // States
  const [userData, setUserData] = useState(null);
  const [points, setPoints] = useState(0);
  const [pendingPoints, setPendingPoints] = useState(0); // 🟢 إضافة حالة النقاط المعلقة
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    governorate: "",
    city: "",
    details: "",
    phone: "",
  });

  // حساب القيمة المالية للنقاط الفعلية فقط
  const pointsInMoney = loyaltyService.calculateMoney(points);
  const fetchFullProfile = async (userId) => {
    try {
      // 🟢 منادي على الـ Endpoint اللي فيه (total_points & pending_points)
      const response = await apiClient.get(`/auth/profile/${userId}`);
      if (response.status === 200) {
        const profile = response.data;
        console.log(profile);

        // تحديث النقاط الفعلية والمعلقة من الداتا بيز
        setPoints(profile.total_points || 0);
        setPendingPoints(profile.pending_points || 0); // 🟢 تحديث النقاط المعلقة هنا

        if (profile.default_address) {
          setAddressForm({
            governorate: profile.default_address.governorate,
            city: profile.default_address.city,
            details: profile.default_address.details,
            phone: profile.default_address.phone,
          });
        }
      }
    } catch (error) {
      console.log("Profile Sync Error:", error.message);
    } finally {
      // ✅ إنهاء حالة التحميل في جميع الأحوال
      setIsLoadingProfile(false);
      setIsRefreshing(false);
    }
  };

  const loadInitialData = async () => {
    try {
      let data;
      const STORAGE_KEY = "userData";

      if (Platform.OS === "web") {
        const sessionData = window.localStorage.getItem(STORAGE_KEY);
        data = sessionData ? JSON.parse(sessionData) : null;
      } else {
        const localData = await AsyncStorage.getItem(STORAGE_KEY);
        data = localData ? JSON.parse(localData) : null;
      }

      if (data) {
        setUserData(data);
        const userId = data.id || data.user?.id;
        if (userId) {
          await fetchFullProfile(userId);
        } else {
          setIsLoadingProfile(false);
        }
      } else {
        // ✅ إذا لم يوجد مستخدم (Guest)، نوقف التحميل فوراً لتظهر واجهة الزائر
        setIsLoadingProfile(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error loading profile storage:", error);
      setIsLoadingProfile(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [user]), // ✅ إعادة التحميل عند تغير حالة المستخدم
  );

  const onRefresh = () => {
    const userId = userData?.id || userData?.user?.id;
    if (userId) {
      setIsRefreshing(true);
      fetchFullProfile(userId);
    }
  };

  const handleSaveAddress = async () => {
    if (
      !addressForm.governorate ||
      !addressForm.city ||
      !addressForm.details ||
      !addressForm.phone
    ) {
      Alert.alert("تنبيه", "يرجى تعبئة جميع بيانات العنوان");
      return;
    }
    const userId = userData?.id || userData?.user?.id;
    setIsSavingAddress(true);
    try {
      const payload = { user_id: userId, ...addressForm };
      // 🟢 ملاحظة: تأكد من صحة مسار حفظ العنوان في الباك إند عندك
      const response = await apiClient.post("/customers/address", payload);
      if (response.status === 200 || response.status === 201) {
        Alert.alert("نجاح", "تم حفظ العنوان بنجاح!");
        setIsEditingAddress(false);
      }
    } catch (error) {
      Alert.alert("خطأ", "فشل في حفظ العنوان");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleLogout = async () => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (error) {
        Alert.alert("خطأ", "فشل تسجيل الخروج");
      }
    };

    if (Platform.OS === "web") {
      if (confirm("هل أنت متأكد أنك تريد الخروج؟")) await performLogout();
    } else {
      Alert.alert("تسجيل الخروج", "هل أنت متأكد من رغبتك في الخروج؟", [
        { text: "إلغاء", style: "cancel" },
        { text: "خروج", style: "destructive", onPress: performLogout },
      ]);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const nameArray = name.trim().split(" ");
    return nameArray.length >= 2
      ? (nameArray[0][0] + nameArray[1][0]).toUpperCase()
      : nameArray[0][0].toUpperCase();
  };

  return {
    user, // ✅ إرجاع حالة المستخدم ليتمكن الـ Navigator/Screen من فحصها
    userData,
    points,
    pendingPoints, // 🟢 إرجاع النقاط المعلقة للـ StatsGrid
    pointsInMoney,
    isLoadingProfile,
    isRefreshing,
    isEditingAddress,
    setIsEditingAddress,
    isSavingAddress,
    addressForm,
    setAddressForm,
    onRefresh,
    handleSaveAddress,
    handleLogout,
    getInitials,
  };
};

export default useProfileLogic;
