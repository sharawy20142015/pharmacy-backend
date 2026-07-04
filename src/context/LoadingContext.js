import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  // 1. تغليف الدوال بـ useCallback عشان نثبت الـ Reference بتاعهم في الذاكرة
  const showLoading = useCallback(() => setIsGlobalLoading(true), []);
  const hideLoading = useCallback(() => setIsGlobalLoading(false), []);

  // 2. تغليف القيم بـ useMemo عشان نمنع إعادة التصيير (Re-renders) غير الضرورية لأي شاشة بتستخدم الـ Context
  const contextValue = useMemo(
    () => ({
      isGlobalLoading,
      showLoading,
      hideLoading,
    }),
    [isGlobalLoading, showLoading, hideLoading],
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
