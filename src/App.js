import "./App.css";
import { Footer } from "./comps/Footer.js";
import { Header } from "./comps/Header.js";
import { MostLiked } from "./comps/MostLiked.js";
import { CreateAnArticle } from "./comps/CreateAnArticle.js";
import { Login } from "./comps/Login.js";
import { SignUp } from "./comps/SignUp.js";
import { Home } from "./comps/Home.js";
import { NotFound } from "./comps/NotFound.js";
import { UserProvider } from "./comps/Contexts/UserContext.js";
import { GlobalErrorProvider } from "./comps/Contexts/GlobalErrorContext.js";
import { Articles } from "./comps/Articles.js";
import { GlobalError } from "./comps/GlobalError.js";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Article } from "./comps/Article.js";
import { MyProfile } from "./comps/MyProfile.js";

function App() {
  return (
    <UserProvider>
      <GlobalErrorProvider>
        <Router basename="/Flick">
          <GlobalError></GlobalError>
          <Header></Header>
          <Routes>
            <Route path="/most-liked" element={<MostLiked />} />
            <Route
              path="/login"
              element={
                <div className="mt-5">
                  <Login />
                </div>
              }
            />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/create-an-article" element={<CreateAnArticle />} />
            <Route path="/articles/user/:id" element={<Articles />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/articles/:id" element={<Article />}></Route>
            <Route exact path="/" element={<Home />} />
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
          <Footer></Footer>
        </Router>
      </GlobalErrorProvider>
    </UserProvider>
  );
}

export default App;
