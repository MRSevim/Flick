import "./App.css";
import { Footer } from "./comps/Footer.js";
import { Header } from "./comps/Header.js";
import { MostLiked } from "./comps/MostLiked.js";
import { CreateAnArticle } from "./comps/Articles/CreateAnArticle.js";
import { Login } from "./comps/Login.js";
import { SignUp } from "./comps/SignUp.js";
import { Home } from "./comps/Home.js";
import { NotFound } from "./comps/NotFound.js";
import { UserProvider } from "./comps/Contexts/UserContext.js";
import { GlobalErrorProvider } from "./comps/Contexts/GlobalErrorContext.js";
import { Articles } from "./comps/Articles/Articles.js";
import { Edit } from "./comps/Articles/Edit.js";
import { GlobalError } from "./comps/GlobalError.js";
import { useUserContext } from "./comps/Contexts/UserContext.js";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Article } from "./comps/Articles/Article.js";
import { MyProfile } from "./comps/MyProfile.js";

function App() {
  return (
    <UserProvider>
      <GlobalErrorProvider>
        <AppContent />
      </GlobalErrorProvider>
    </UserProvider>
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
