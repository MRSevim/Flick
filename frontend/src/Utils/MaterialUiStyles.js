import { createTheme } from "@mui/material";

export const createMuiTheme = (darkMode) => {
  return createTheme({
    components: {
      MuiSwitch: {
        styleOverrides: {
          root: {
            "& .MuiSwitch-thumb": {
              backgroundColor: darkMode ? "#fff" : "var(--color-info)",
            },
            "& .MuiSwitch-track": {
              backgroundColor: "var(--color-secondary) !important",
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            ".MuiAutocomplete-listbox	": {
              backgroundColor: "red",
            },
          },
        },
      },
    },
  });
};
