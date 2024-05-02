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
import { ResendVerificationEmail } from "./components/ResendVerificationEmail.js";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <GlobalErrorProvider>
          <ConfirmationProvider>
            <AppContent />
          </ConfirmationProvider>
        </GlobalErrorProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

function AppContent() {
  const [user] = useUserContext();

  return (
    <Router basename="/">
      <GlobalError></GlobalError>
      <Header></Header>
      <Confirmation></Confirmation>
      <Routes>
        {" "}
        <Route path="/most-liked" element={<MostLiked />} />
        <Route
          path="/resend-verification-email"
          element={<ResendVerificationEmail />}
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={links.homepage} />
            ) : (
              <div className="mt-5">
                <Login />
              </div>
            )
          }
        />
        <Route
          path="/sign-up"
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
        <Route path="/followers/:id" element={<Follows type="followers" />} />
        <Route path="/followings/:id" element={<Follows type="followings" />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/about" element={<About />} />
        <Route exact path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}
export default App;
