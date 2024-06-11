import { Footer } from "./components/Footer.js";
import { Header } from "./components/Header.js";
import { MostLiked } from "./components/MostLiked.js";
import { CreateAnArticle } from "./components/Articles/CreateAnArticle.js";
import { Login } from "./components/Login.js";
import { SignUp } from "./components/SignUp.js";
import { Home } from "./components/Home.js";
import { NotFound } from "./components/NotFound.js";
import { UserProvider } from "./Contexts/UserContext.js";
import { GlobalErrorProvider } from "./Contexts/GlobalErrorContext.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Articles } from "./components/Articles/Articles.js";
import { Edit } from "./components/Articles/Edit.js";
import { GlobalError } from "./components/GlobalError.js";
import { useUserContext } from "./Contexts/UserContext.js";
import { Search } from "./components/Search.js";
import { Follows } from "./components/Follows.js";
import { About } from "./components/About.js";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Article } from "./components/Articles/Article.js";
import { MyProfile } from "./components/MyProfile.js";
import { User } from "./components/User.js";
import links from "./Utils/Links.js";
import { ConfirmationProvider } from "./Contexts/UseConfirmationContext.js";

import { Confirmation } from "./components/Confirmation.js";
import { Emailer } from "./components/Emailer.js";
import { EmailVerification } from "./components/EmailVerification.js";
import {
  DarkModeProvider,
  useDarkModeContext,
} from "./Contexts/DarkModeContext.js";
import { ThemeProvider } from "@mui/material";
import { createMuiTheme } from "./Utils/MaterialUiStyles.js";
import { Pms } from "./components/Pms.js";
import { RefetchForPmIconProvider } from "./Contexts/RefetchForPmIcon.js";
import { ConfirmationErrorProvider } from "./Contexts/UseConfirmationErrorContext.js";
import { Settings } from "./components/Settings.js";
import { TocAndPrivacyPolicy } from "./components/TocAndPrivacyPolicy.js";
import { envVariables } from "./Utils/HelperFuncs.js";

function App() {
  return (
    <GoogleOAuthProvider clientId={envVariables.googleId}>
      <UserProvider>
        <RefetchForPmIconProvider>
          <GlobalErrorProvider>
            <DarkModeProvider>
              <ConfirmationErrorProvider>
                <ConfirmationProvider>
                  <AppContent />
                </ConfirmationProvider>
              </ConfirmationErrorProvider>
            </DarkModeProvider>
          </GlobalErrorProvider>
        </RefetchForPmIconProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

function AppContent() {
  const [user] = useUserContext();
  const [darkMode] = useDarkModeContext();
  const theme = createMuiTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <Router basename="/">
        <GlobalError></GlobalError>
        <Header></Header>
        <Confirmation></Confirmation>
        <Routes>
          {" "}
          <Route path="/most-liked" element={<MostLiked />} />
          <Route
            path="/toc-and-privacy-policy"
            element={<TocAndPrivacyPolicy />}
          />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/pms"
            element={!user ? <Navigate to={links.homepage} /> : <Pms />}
          />
          <Route path="/emailer" element={<Emailer />} />
          <Route
            path="/login"
            element={user ? <Navigate to={links.homepage} /> : <Login />}
          />
          <Route
            path="/sign-up/:token?"
            element={user ? <Navigate to={links.homepage} /> : <SignUp />}
          />
          <Route path="/create-an-article" element={<CreateAnArticle />} />
          <Route
            path="/article/user/:id/articles"
            element={<Articles isDraft={false} />}
          />
          <Route
            path="/article/user/:id/drafts"
            element={<Articles isDraft={true} />}
          />
          <Route path="/search" element={<Search />} />
          <Route
            path="/:id/followers/"
            element={<Follows type="followers" />}
          />
          <Route
            path="/:id/following/"
            element={<Follows type="following" />}
          />
          <Route path="/user/:id" element={<User />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/about" element={<About />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/:token" element={<EmailVerification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer></Footer>
      </Router>
    </ThemeProvider>
  );
}
export default App;
