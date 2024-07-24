import { createContext, useState, useContext } from "react";

const ConfirmationErrorContext = createContext(null);

export const useConfirmationErrorContext = () => {
  return useContext(ConfirmationErrorContext);
};

export const ConfirmationErrorProvider = ({ children }) => {
  const [confirmationError, setConfirmationError] = useState(null);

  return (
    <ConfirmationErrorContext.Provider
      value={[confirmationError, setConfirmationError]}
    >
      {children}
    </ConfirmationErrorContext.Provider>
  );
};

export default ConfirmationErrorContext;
