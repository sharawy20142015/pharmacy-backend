import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import apiClient from "../services/apiClient";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRTL, setIsRTL] = useState(false); // تقدر تخليها true لو عايز العربي هو الافتراضي

  // دالة النجاح للتحويل لصفحة البروفايل
  const onLoginSuccess = () => {
    window.location.reload();
  };

  // دالة تسجيل الدخول العادي
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Login with:", email, password);
      // const res = await apiClient.post('/auth/login', { email, password });
      setTimeout(() => {
        setIsLoading(false);
        // onLoginSuccess();
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      alert("فشل تسجيل الدخول");
    }
  };

  // دالة تسجيل الدخول بجوجل
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const userInfo = await userInfoResponse.json();

        const payload = {
          google_id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          avatar_url: userInfo.picture,
        };

        const res = await apiClient.post("/auth/google", payload);
        localStorage.setItem("access_token", res.data.access_token);

        onLoginSuccess();
      } catch (error) {
        console.error("Auth Error:", error);
        alert("فشل تسجيل الدخول بواسطة جوجل");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => console.log("Google Login Failed", error),
  });

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-[#f6f8f6] dark:bg-[#102216] font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-all duration-300"
    >
      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-[#10b748]/5 overflow-hidden border border-slate-100 dark:border-slate-800 relative">
          {/* شاشة التحميل */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#10b748]"></div>
            </div>
          )}

          {/* Logo Section */}
          <div className="pt-10 pb-6 flex flex-col items-center gap-3">
            <div className="size-16 bg-[#10b748]/10 rounded-full flex items-center justify-center text-[#10b748]">
              <svg
                className="size-10"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Nabd Pharmacy
            </h1>
          </div>

          {/* Welcome Text */}
          <div className="px-8 pb-8 text-center space-y-1">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Please login to your medical account
            </p>
          </div>

          {/* Form Section */}
          <form className="px-8 space-y-5" onSubmit={handleLogin}>
            {/* Email/Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email or Phone Number
              </label>
              <div className="relative group">
                <span
                  className={`material-symbols-outlined absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#10b748]`}
                >
                  person
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#10b748]/20 focus:border-[#10b748] outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white`}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-[#38BDF8] hover:underline uppercase tracking-wider"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative group">
                <span
                  className={`material-symbols-outlined absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#10b748]`}
                >
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full ${isRTL ? "pr-12 pl-12" : "pl-12 pr-12"} py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#10b748]/20 focus:border-[#10b748] outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200`}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              className="w-full py-4 bg-[#10b748] hover:bg-[#10b748]/90 text-white font-bold rounded-lg shadow-lg shadow-[#10b748]/20 transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xl">login</span>
              Login
            </button>
          </form>

          {/* Social Login */}
          <div className="px-8 pt-8 pb-6">
            <div className="relative flex items-center justify-center mb-6">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Quick Login with
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* زرار جوجل المربوط بالباك إند */}
              <button
                onClick={() => googleLogin()}
                type="button"
                className="flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold text-slate-700 dark:text-slate-200"
              >
                <img
                  alt="Google"
                  className="size-5"
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg"
                />
                Google
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold text-slate-700 dark:text-slate-200"
              >
                <span className="material-symbols-outlined text-xl">ios</span>
                Apple
              </button>
            </div>
          </div>

          {/* Marketing Banner */}
          <div className="mx-8 mb-8 p-4 bg-[#10b748]/5 dark:bg-[#10b748]/10 rounded-lg border border-[#10b748]/10 flex items-center gap-4">
            <div className="size-10 bg-[#10b748] text-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-xl">
                verified_user
              </span>
            </div>
            <div className="flex flex-col text-left">
              <p className="text-xs font-bold text-[#10b748] uppercase tracking-tighter leading-none mb-1">
                New Opportunity
              </p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">
                Join the Chronic Disease Program and{" "}
                <span className="text-[#10b748] font-bold">save up to 20%</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 dark:bg-slate-800/50 py-6 px-8 text-center border-t border-slate-100 dark:border-slate-800">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Don't have an account?
              <a
                href="#"
                className="text-[#10b748] font-bold hover:underline ml-1"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Page Footer / Copyright */}
      <footer className="py-6 text-center text-slate-400 text-xs">
        <p>
          © 2026 Nabd Pharmacy Medical Portal. All rights reserved. Secure
          256-bit SSL encrypted login.
        </p>
      </footer>

      {/* RTL Toggle FAB */}
      <button
        onClick={() => setIsRTL(!isRTL)}
        className="fixed bottom-6 right-6 size-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#10b748] transition-colors z-50"
      >
        <span className="material-symbols-outlined">translate</span>
      </button>
    </div>
  );
};

export default Login;
