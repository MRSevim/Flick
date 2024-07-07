import { DarkModeProvider } from "@/contexts/DarkModeContext";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.scss";
import { ClientInitializer } from "@/components/ClientInitializer";
import { UserProvider } from "@/contexts/UserContext";
import { RefetchForPmIconProvider } from "@/contexts/RefetchForPmIcon";
import { GlobalErrorProvider } from "@/contexts/GlobalErrorContext";
import { ConfirmationErrorProvider } from "@/contexts/ConfirmationErrorContext";
import { ConfirmationProvider } from "@/contexts/ConfirmationContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeWrapper } from "./ThemeWrapper";
import { Header } from "@/components/Header/Header";
import { Nunito } from "next/font/google";
import { envVariables } from "@/utils/HelperFuncs";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | Flick Articles",
    default: "Flick Articles - Write Freely & Share",
  },
  description:
    "Express yourself through writing! Share your thoughts, stories, and ideas on our free writing platform. Find encouragement and support from a community of writers.",

  keywords: [
    "writing",
    "reading",
    "free writing",
    "online writing platform",
    "conscious writing",
    "creative writing",
    "share writings",
    "online writing community",
  ],
  alternates: {
    canonical: `https://www.flickarticles.com/`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleOAuthProvider clientId={envVariables.googleId}>
        <UserProvider>
          <RefetchForPmIconProvider>
            <GlobalErrorProvider>
              <DarkModeProvider>
                <ConfirmationErrorProvider>
                  <ConfirmationProvider>
                    <AppContent>{children}</AppContent>
                  </ConfirmationProvider>
                </ConfirmationErrorProvider>
              </DarkModeProvider>
            </GlobalErrorProvider>
          </RefetchForPmIconProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </html>
  );
}

function AppContent({ children }) {
  return (
    <body className={"hidden " + nunito.className} suppressHydrationWarning>
      <Header />
      <ThemeWrapper>
        {children}
        <ClientInitializer />
      </ThemeWrapper>
    </body>
  );
}
