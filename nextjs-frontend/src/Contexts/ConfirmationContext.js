"use client";
import { createContext, useState, useContext } from "react";

const ConfirmationContext = createContext(null);

export const useConfirmationContext = () => {
  return useContext(ConfirmationContext);
};

export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState({
    ref: null,
    type: "",
    info: null,
    functionToRun: null,
    isLoading: null,
  });

  return (
    <ConfirmationContext.Provider
      value={{
        confirmation,
        setConfirmation,
      }}
    >
      {children}
    </ConfirmationContext.Provider>
  );
};

export default ConfirmationContext;
