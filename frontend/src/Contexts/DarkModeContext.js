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

  const handleChange = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
    document.body.classList.toggle("dark");
  };
  return (
    <DarkModeContext.Provider value={[darkMode, handleChange]}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
