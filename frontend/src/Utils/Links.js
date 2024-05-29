const links = {
  pms: "/pms?open=false&page=1&type=received",
  sendPm: (username, id) => {
    return `/pms?open=true&page=1&type=sent&username=${username}&_id=${id}`;
  },
  homepage: "/",
  mostLiked: "/most-liked?time=week",
  createAnArticle: "/create-an-article",
  myProfile: "/my-profile",
  about: "/about",
  login: "/login",
  signup: "/sign-up",
  linkedIn: "https://www.linkedin.com/in/muhammed-ra%C5%9Fid-sevim/",
  portfolio: "https://mrsevim.github.io/Portfolio/",
  mail: "mailto: lionrasit@gmail.com",
  resendVerificationEmail: (email) => {
    const url = email
      ? "/resend-verification-email?email=" + email
      : "/resend-verification-email";
    return url;
  },
  followers: (id) => {
    return "/followers/" + id;
  },
  followings: (id) => {
    return "/followings/" + id;
  },
  publicUser: (id) => {
    return "/user/" + id;
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
  tag: (tag) => {
    return "/search?advancedSearch=true&username=&title=&tags=" + tag;
  },
};

export default links;
