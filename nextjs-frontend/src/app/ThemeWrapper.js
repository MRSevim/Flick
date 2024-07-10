"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CreateMuiTheme } from "@/utils/MaterialUiStyles";
import { ThemeProvider } from "@mui/material/styles";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { useEffect } from "react";

export const ThemeWrapper = ({ children }) => {
    useEffect(() => {
      require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);
    
  const [darkMode] = useDarkModeContext();
  const theme = CreateMuiTheme(darkMode);
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
};
