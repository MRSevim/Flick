import React from "react";
import Switch from "@mui/material/Switch";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import classNames from "classnames";

export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useDarkModeContext();

  const handleChange = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
    document.body.classList.toggle("dark");
  };
  return (
    <>
      <i
        className={classNames({
          "bi h4 m-0": true,
          "bi-moon-fill": darkMode,
          "bi-moon": !darkMode,
        })}
      ></i>
      <Switch
        checked={darkMode}
        onChange={handleChange}
        inputProps={{ "aria-label": "controlled" }}
      />
    </>
  );
};
