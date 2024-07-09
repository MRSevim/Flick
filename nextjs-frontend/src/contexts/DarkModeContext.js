"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { getClientSideCookie } from "@/utils/HelperFuncs";

const DarkModeContext = createContext(null);

export const useDarkModeContext = () => {
  return useContext(DarkModeContext);
};

export const DarkModeProvider = ({ children, darkModeFromCookies }) => {
  const [darkMode, setDarkMode] = useState(darkModeFromCookies);

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkMode && !getClientSideCookie(darkMode)) {
      document.cookie = "darkMode=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, [setDarkMode]);

  const handleChange = () => {
    setDarkMode((prev) => {
      document.cookie = `darkMode=${!prev}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      if (!prev === true) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
      return !prev;
    });
  };

  return (
    <DarkModeContext.Provider value={[darkMode, handleChange]}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
