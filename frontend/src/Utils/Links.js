const links = {
  homepage: "/",
  mostLiked: "/most-liked",
  createAnArticle: "/create-an-article",
  myProfile: "/my-profile",
  about: "/about",
  login: "/login",
  signup: "/sign-up",
  linkedIn: "https://www.linkedin.com/in/muhammed-ra%C5%9Fid-sevim/",
  portfolio: "https://mrsevim.github.io/Portfolio/",
  mail: "mailto: lionrasit@gmail.com",
  followers: (id) => {
    return "/followers/" + id;
  },
  followings: (id) => {
    return "/followings/" + id;
  },
  publicUser: (username) => {
    return "/user/" + username;
  },
  article: (id) => {
    return "/article/" + id;
  },
  allArticles: (id) => {
    return "/article/user/" + id + "/articles?page=1";
  },
  allDrafts: (id) => {
    return "/article/user/" + id + "/drafts?page=1";
  },
  edit: (id, isDraft) => {
    return "/edit/" + id + "?isDraft=" + isDraft;
  },
  search: (param) => {
    return "/search?q=" + param;
  },
};

export default links;
