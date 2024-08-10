"use client";
import Cookies from "js-cookie";
import { createContext, useState, useContext, useEffect } from "react";

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
    if (prefersDarkMode && !Cookies.get("darkMode")) {
      Cookies.set("darkMode", "true", { expires: 1000 });

      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, [setDarkMode]);

  const handleChange = () => {
    setDarkMode((prev) => {
      Cookies.set("darkMode", `${!prev}`, { expires: 1000 });
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
