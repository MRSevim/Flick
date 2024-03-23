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

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Article } from "./components/Articles/Article.js";
import { MyProfile } from "./components/MyProfile.js";
import { User } from "./components/User.js";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <GlobalErrorProvider>
          <AppContent />
        </GlobalErrorProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

function AppContent() {
  const [user] = useUserContext();

  return (
    <Router basename="/Flick">
      <GlobalError></GlobalError>
      <Header></Header>
      <Routes>
        {" "}
        <Route path="/most-liked" element={<MostLiked />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" />
            ) : (
              <div className="mt-5">
                <Login />
              </div>
            )
          }
        />
        <Route
          path="/sign-up"
          element={user ? <Navigate to="/" /> : <SignUp />}
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
        <Route path="/user/:username" element={<User />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/article/edit/:id" element={<Edit isDraft={false} />} />
        <Route path="/draft/edit/:id" element={<Edit isDraft={true} />} />
        <Route path="/article/:id" element={<Article isDraft={false} />} />
        <Route path="/draft/:id" element={<Article isDraft={true} />} />
        <Route exact path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}
export default App;
