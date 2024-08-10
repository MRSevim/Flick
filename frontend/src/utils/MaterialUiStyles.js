import { createTheme } from "@mui/material/styles";

export const CreateMuiTheme = (darkMode) => {
  return createTheme({
    components: {
      //Switch is not used, but stays just in case
      MuiSwitch: {
        styleOverrides: {
          root: {
            "& .MuiSwitch-thumb": {
              backgroundColor: darkMode ? "#fff" : "var(--color-info)",
            },
            "&& .MuiSwitch-track": {
              backgroundColor: "var(--color-secondary) !important",
            },
            "&& .Mui-checked + .MuiSwitch-track": {
              backgroundColor: "var(--color-info) !important",
            },
          },
        },
      },
      MuiPopper: {
        styleOverrides: {
          root: {
            "& .MuiAutocomplete-listbox": {
              border: "1px solid #fff",
              borderRadius: "6px",
            },
            "& .MuiAutocomplete-loading,.MuiAutocomplete-noOptions": {
              color: "var(--color-info)",
              backgroundColor: "var(--color-primary)",
            },
            "& .MuiAutocomplete-listbox,.MuiAutocomplete-groupLabel": {
              backgroundColor: darkMode && "var(--color-primary)",
              color: darkMode && "#fff",
            },
            "& .MuiAutocomplete-clearIndicator": {
              color: "red",
            },
            "& .MuiAutocomplete-groupUl .MuiAutocomplete-option[aria-selected='true']":
              {
                backgroundColor: "transparent !important",
              },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            "& label": {
              color: darkMode ? " var(--color-info)" : "#000",
              backgroundColor: "var(--color-primary)",
              padding: "0 5px 0",
              borderRadius: "4px",
            },
            "& label.Mui-focused": {
              color: "var(--color-info)",
              backgroundColor: "var(--color-primary)",
              padding: "5px",
              borderRadius: "5px",
            },
            "& .MuiInputBase-root": {
              backgroundColor: darkMode && "var(--color-info)",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: darkMode && "var(--color-info)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderWidth: "1px",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#80d4d2",
              boxShadow: "0 0 0 0.25rem rgba(0, 169, 165, 0.25)",
            },
          },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--color-primary)",
            borderRadius: "6px",
            "& .MuiPaginationItem-root": {
              color: "var(--color-info)",
            },
          },
        },
      },
    },
  });
};
