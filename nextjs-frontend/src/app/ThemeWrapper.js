"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CreateMuiTheme } from "@/utils/MaterialUiStyles";
import { ThemeProvider } from "@mui/material/styles";
import { useDarkModeContext } from "@/contexts/DarkModeContext";

export const ThemeWrapper = ({ children }) => {
  const [darkMode] = useDarkModeContext();
  const theme = CreateMuiTheme(darkMode);
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
};
