import "./App.css";
import { Footer } from "./comps/Footer.js";
import { Header } from "./comps/Header.js";
import { MostLiked } from "./comps/MostLiked.js";
import { CreateAnArticle } from "./comps/CreateAnArticle.js";
import { Login } from "./comps/Login.js";
import { SignUp } from "./comps/SignUp.js";
import { Home } from "./comps/Home.js";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header></Header>
      <Routes>
        <Route path="/most-liked" Component={MostLiked} />
        <Route path="/login" Component={Login} />
        <Route path="/sign-up" Component={SignUp} />
        <Route path="/create-an-article" Component={CreateAnArticle} />
        <Route path="/" Component={Home} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
