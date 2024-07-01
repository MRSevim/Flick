"use client";
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
    }
  }, [setDarkMode]);

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem("darkMode", darkMode);
      document.body.classList.add("dark");
    } else {
      localStorage.setItem("darkMode", darkMode);
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const handleChange = () => {
    setDarkMode(!darkMode);
  };
  return (
    <DarkModeContext.Provider value={[darkMode, handleChange]}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
