import { createContext, useState, useContext } from "react";

const ConfirmationContext = createContext(null);

export const useConfirmationContext = () => {
  return useContext(ConfirmationContext);
};

let outsideResolve;
const confirmed = new Promise((resolve) => {
  outsideResolve = resolve;
});

export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState({
    confirmed,
    outsideResolve,
    ref: null,
    isLoading: null,
    type: "",
    info: null,
  });

  const resetConfirmationPromise = () => {
    const newConfirmed = new Promise((resolve) => {
      outsideResolve = resolve;
    });

    setConfirmation((prevConfirmation) => ({
      ...prevConfirmation,
      confirmed: newConfirmed,
      outsideResolve,
    }));
  };

  return (
    <ConfirmationContext.Provider
      value={{ confirmation, setConfirmation, resetConfirmationPromise }}
    >
      {children}
    </ConfirmationContext.Provider>
  );
};

export default ConfirmationContext;
