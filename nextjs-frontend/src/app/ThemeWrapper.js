"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { CreateMuiTheme } from "@/utils/MaterialUiStyles";
import { ThemeProvider } from "@mui/material/styles";

export const ThemeWrapper = ({ children }) => {
  const [darkMode] = useDarkModeContext();
  const theme = CreateMuiTheme(darkMode);
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
};
