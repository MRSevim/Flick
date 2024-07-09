"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { getClientSideCookie } from "@/utils/HelperFuncs";
const DarkModeContext = createContext(null);

/* if (typeof window !== "undefined") {
  prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.cookie = "darkMode=true";
} */

export const useDarkModeContext = () => {
  return useContext(DarkModeContext);
};
/* if (typeof window !== "undefined") {
  darkModeFromStorage = localStorage.getItem("darkMode") === "true";
  if (darkModeFromStorage) {
    document.body.classList.add("dark");
  }
  document.body.classList.remove("hidden");
} */

export const DarkModeProvider = ({ children, darkMode }) => {
  const [darkModeState, setDarkModeState] = useState(darkMode);

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkMode && getClientSideCookie(darkMode)) {
      document.cookie = "darkMode=true";
    }
  }, [setDarkModeState]);

  const handleChange = () => {
    setDarkModeState((prev) => {
      return !prev;
    });
  };

  return (
    <DarkModeContext.Provider value={[darkModeState, handleChange]}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
