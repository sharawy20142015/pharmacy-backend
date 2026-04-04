import React from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  RefreshControl,
  useWindowDimensions,
  Text,
} from "react-native";
import { styles, COLORS } from "./ProfileStyles";
import useProfileLogic from "./components/useProfileLogic";
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
} from "@expo-google-fonts/tajawal";

// Components
import UserInfoCard from "./components/UserInfoCard";
import StatsGrid from "./components/StatsGrid";
import AddressSection from "./components/AddressSection";
import SupportCard from "./components/SupportCard";

// استيراد صفحة اللوجن التي تحتوي على زر جوجل
import LoginScreen from "../Login/LoginScreen";
const ProfileScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 992;

  let [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
  });

  const {
    userData,
    points,
    pendingPoints,
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
    user,
  } = useProfileLogic();

  // 1. واجهة التحميل (أثناء فحص الخطوط أو حالة المستخدم)
  if (!fontsLoaded || isLoadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // 2. واجهة الزائر: إذا لم يكن هناك "user"، اعرض صفحة اللوجن فوراً
  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <LoginScreen />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 3. واجهة المستخدم المسجل (البروفايل)
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={[
              styles.mainContainer,
              { maxWidth: 800, alignSelf: "center" },
            ]}
          >
            {/* كارت المعلومات الأساسية */}
            <UserInfoCard
              userName={userData?.user?.name || userData?.name || "مستخدم جديد"}
              userEmail={userData?.user?.email || userData?.email}
              userAvatar={userData?.user?.avatar_url || userData?.avatar_url}
              getInitials={getInitials}
            />

            <View style={{ gap: 20 }}>
              {/* كارت النقاط */}
              <StatsGrid
                points={points}
                pendingPoints={pendingPoints}
                pointsInMoney={pointsInMoney}
                isLargeScreen={false}
              />

              {/* قسم العنوان */}
              <AddressSection
                isEditingAddress={isEditingAddress}
                setIsEditingAddress={setIsEditingAddress}
                addressForm={addressForm}
                setAddressForm={setAddressForm}
                handleSaveAddress={handleSaveAddress}
                isSavingAddress={isSavingAddress}
                isLargeScreen={isLargeScreen}
              />

              {/* كارت الدعم وتسجيل الخروج */}
              <SupportCard onLogout={handleLogout} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
