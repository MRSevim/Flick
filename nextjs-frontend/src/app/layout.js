import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.scss";
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
import { cookies } from "next/headers";
import React from "react";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import { Footer } from "@/components/Footer/Footer";
import { GlobalError } from "@/components/GlobalError";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | " + envVariables.websiteName,
    default: envVariables.websiteName + " - Write Freely & Share",
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
  const darkModeFromCookies = cookies().get("darkMode")?.value === "true";
  const userFromCookies = cookies().get("user")?.value
    ? JSON.parse(cookies().get("user")?.value)
    : undefined;

  return (
    <html lang="en">
      <GoogleOAuthProvider clientId={envVariables.googleId}>
        <UserProvider userFromCookies={userFromCookies}>
          <RefetchForPmIconProvider>
            <GlobalErrorProvider>
              <ConfirmationErrorProvider>
                <ConfirmationProvider>
                  <DarkModeProvider darkModeFromCookies={darkModeFromCookies}>
                    <ThemeWrapper>
                      <body
                        className={
                          (darkModeFromCookies ? "dark " : "") +
                          nunito.className
                        }
                      >
                        <Header />
                        <GlobalError />
                        <div className="pb-5 pt-4">{children}</div>
                        <Footer />
                      </body>
                    </ThemeWrapper>
                  </DarkModeProvider>
                </ConfirmationProvider>
              </ConfirmationErrorProvider>
            </GlobalErrorProvider>
          </RefetchForPmIconProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </html>
  );
}
