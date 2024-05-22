import { createContext, useState, useContext, useEffect } from "react";

const DarkModeContext = createContext(null);

let prefersDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const useDarkModeContext = () => {
  return useContext(DarkModeContext);
};

let darkModeFromStorage = localStorage.getItem("darkMode") === "true";
if (darkModeFromStorage) {
  document.body.classList.add("dark");
}

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(darkModeFromStorage);
  useEffect(() => {
    if (prefersDarkMode && localStorage.getItem("darkMode") === null) {
      setDarkMode(true);
      localStorage.setItem("darkMode", true);
      document.body.classList.add("dark");
    }
  }, [setDarkMode]);

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
