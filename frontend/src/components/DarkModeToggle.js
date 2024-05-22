import React from "react";
import Switch from "@mui/material/Switch";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import classNames from "classnames";

export const DarkModeToggle = () => {
  const [darkMode, handleChange] = useDarkModeContext();

  return (
    <>
      <i
        className={classNames({
          "bi h4 m-0 d-flex flex-column justify-content-center negative-margin-right": true,
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
