"use client";
import { createContext, useState, useContext } from "react";

const RefetchForPmIconContext = createContext(null);

export const useRefetchForPmIconContext = () => {
  return useContext(RefetchForPmIconContext);
};

export const RefetchForPmIconProvider = ({ children }) => {
  const [refetchForPmIcon, setRefetchForPmIcon] = useState(0);

  return (
    <RefetchForPmIconContext.Provider
      value={[refetchForPmIcon, setRefetchForPmIcon]}
    >
      {children}
    </RefetchForPmIconContext.Provider>
  );
};

export default RefetchForPmIconContext;
