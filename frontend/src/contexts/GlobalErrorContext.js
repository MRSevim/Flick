"use client";
import { createContext, useState, useContext } from "react";

const GlobalErrorContext = createContext(null);

export const useGlobalErrorContext = () => {
  return useContext(GlobalErrorContext);
};

export const GlobalErrorProvider = ({ children }) => {
  const [globalError, setGlobalError] = useState(null);

  return (
    <GlobalErrorContext.Provider value={[globalError, setGlobalError]}>
      {children}
    </GlobalErrorContext.Provider>
  );
};

export default GlobalErrorContext;
