"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CreateMuiTheme } from "@/utils/MaterialUiStyles";
import { ThemeProvider } from "@mui/material/styles";

export const ThemeWrapper = ({ children, darkMode }) => {
  const muiTheme = CreateMuiTheme(darkMode);
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
};
