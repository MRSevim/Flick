import { createContext, useState, useContext } from "react";

const DarkModeContext = createContext(null);

export const useDarkModeContext = () => {
  return useContext(DarkModeContext);
};

let darkModeFromStorage = localStorage.getItem("darkMode") === "true";
if (darkModeFromStorage) {
  document.body.classList.add("dark");
}

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(darkModeFromStorage);

  return (
    <DarkModeContext.Provider value={[darkMode, setDarkMode]}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
