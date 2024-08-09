import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.scss";
import { UserProvider } from "@/contexts/UserContext";
import { GlobalErrorProvider } from "@/contexts/GlobalErrorContext";
import { ConfirmationErrorProvider } from "@/contexts/ConfirmationErrorContext";
import { ConfirmationProvider } from "@/contexts/ConfirmationContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeWrapper } from "./ThemeWrapper";
import { Header } from "@/components/Header/Header";
import { Nunito } from "next/font/google";
import { envVariables } from "@/utils/HelperFuncs";
import { cookies } from "next/headers";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import { Footer } from "@/components/Footer/Footer";
import { GlobalError } from "@/components/GlobalError";
import { Confirmation } from "@/components/Confirmation";
import { LoadingDots } from "@/components/LoadingDots";
import { NotificationsParent } from "@/components/Header/NotificationsParent";
import { PmIconParent } from "@/components/Header/PmIconParent";
import { Suspense } from "react";
import Script from "next/script";
import { RegularFetchCallWrapper } from "./RegularFetchCallWrapper";

const nunito = Nunito({ weight: ["400", "700"], subsets: ["latin"] });

const title = envVariables.websiteName + " - Write Freely & Share";
const description =
  "Express yourself through writing! Share your thoughts, stories, and ideas on our free writing platform. Find encouragement and support from a community of writers.";

export const metadata = {
  title: {
    template: "%s | " + envVariables.websiteName,
    default: title,
  },
  description,
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
    canonical: envVariables.frontendUrl,
  },
  openGraph: {
    title,
    description,
  },
};

export default function RootLayout({ children }) {
  const darkModeFromCookies = cookies().get("darkMode")?.value === "true";
  const userFromCookies = cookies().get("user")?.value
    ? JSON.parse(cookies().get("user")?.value)
    : undefined;

  return (
    <html lang="en">
      <head>
        <Script
          async
          src={
            "https://www.googletagmanager.com/gtag/js?id=" +
            envVariables.googleAnalyticsId
          }
        />
        <Script id="google-analytics">
          {` window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());

          gtag("config", "${envVariables.googleAnalyticsId}");`}
        </Script>
      </head>
      <GoogleOAuthProvider clientId={envVariables.googleId}>
        <UserProvider userFromCookies={userFromCookies}>
          <GlobalErrorProvider>
            <ConfirmationErrorProvider>
              <ConfirmationProvider>
                <DarkModeProvider darkModeFromCookies={darkModeFromCookies}>
                  <ThemeWrapper>
                    <RegularFetchCallWrapper>
                      <body
                        className={
                          (darkModeFromCookies ? "dark " : "") +
                          nunito.className
                        }
                      >
                        <Header>
                          {cookies().get("user") && cookies().get("jwt") && (
                            <>
                              <Suspense fallback={<LoadingDots />}>
                                <NotificationsParent />
                              </Suspense>

                              <Suspense fallback={<LoadingDots />}>
                                <PmIconParent />
                              </Suspense>
                            </>
                          )}
                        </Header>
                        <GlobalError />
                        <Confirmation />
                        <div className="pb-5 pt-4">{children}</div>
                        <Footer />
                      </body>
                    </RegularFetchCallWrapper>
                  </ThemeWrapper>
                </DarkModeProvider>
              </ConfirmationProvider>
            </ConfirmationErrorProvider>
          </GlobalErrorProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </html>
  );
}
