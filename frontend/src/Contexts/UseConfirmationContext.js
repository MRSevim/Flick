import { createContext, useState, useContext } from "react";

const ConfirmationContext = createContext(null);

export const useConfirmationContext = () => {
  return useContext(ConfirmationContext);
};

export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState({
    confirmed: null,
    ref: null,
    isLoading: null,
    info: { text: "", title: null },
  });

  return (
    <ConfirmationContext.Provider value={[confirmation, setConfirmation]}>
      {children}
    </ConfirmationContext.Provider>
  );
};

export default ConfirmationContext;
