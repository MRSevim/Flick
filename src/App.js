import "./App.css";
import { Footer } from "./comps/Footer.js";
import { Header } from "./comps/Header.js";
import { MostLiked } from "./comps/MostLiked.js";
import { CreateAnArticle } from "./comps/CreateAnArticle.js";
import { Login } from "./comps/Login.js";
import { SignUp } from "./comps/SignUp.js";
import { Home } from "./comps/Home.js";
import { NotFound } from "./comps/NotFound.js";
import { UserProvider } from "./comps/UserContext.js";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Article } from "./comps/Article.js";

function App() {
  return (
    <UserProvider>
      <Router>
        <Header></Header>
        <Routes>
          <Route path="/most-liked" element={<MostLiked />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/create-an-article" element={<CreateAnArticle />} />
          <Route path="/articles/:id" element={<Article />}></Route>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
        <Footer></Footer>
      </Router>
    </UserProvider>
  );
}

export default App;
