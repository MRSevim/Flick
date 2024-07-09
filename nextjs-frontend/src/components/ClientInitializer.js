"use client";
import { getDarkMode } from "@/utils/HelperFuncs";
import { useEffect } from "react";

export const ClientInitializer = () => {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    /*  const darkMode = getDarkMode();
    if (darkMode) {
      document.body.classList.add("dark");
    } */
  }, []);

  return null;
};
