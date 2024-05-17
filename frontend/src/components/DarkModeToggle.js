import React from "react";
import Switch from "@mui/material/Switch";
import { useDarkModeContext } from "../Contexts/DarkModeContext";

export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useDarkModeContext();

  const handleChange = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
    document.body.classList.toggle("dark");
  };
  return (
    <>
      <i className="bi bi-moon"></i>

      <Switch
        checked={darkMode}
        onChange={handleChange}
        inputProps={{ "aria-label": "controlled" }}
      />
    </>
  );
};
