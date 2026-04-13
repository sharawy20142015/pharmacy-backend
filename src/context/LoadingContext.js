import React, { createContext, useState, useContext } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  // دالة بنناديها لما نبدأ نطلب داتا، ودالة لما نخلص
  const showLoading = () => setIsGlobalLoading(true);
  const hideLoading = () => setIsGlobalLoading(false);

  return (
    <LoadingContext.Provider
      value={{ isGlobalLoading, showLoading, hideLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
