import { envVariables } from "./HelperFuncs";
const links = {
  pms: "/pms?open=false&page=1&type=received",
  tocAndPrivacyPolicy: "/toc-and-privacy-policy",
  settings: "/settings",
  sendPm: (username, id) => {
    return `/pms?open=true&page=1&type=sent&username=${username}&_id=${id}`;
  },
  homepage: "/",
  mostLiked: "/most-liked?time=week",
  createAnArticle: "/create-an-article",
  myProfile: "/my-profile",
  about: "/about",
  login: "/login",
  signup: (token) => {
    if (token) {
      return "/sign-up/" + token;
    } else {
      return "/sign-up";
    }
  },
  linkedIn: "https://www.linkedin.com/in/muhammed-ra%C5%9Fid-sevim/",
  portfolio: "https://mrsevim.github.io/Portfolio/",
  mail: "mailto: " + envVariables.email,
  emailer: (email, type) => {
    const url = email
      ? "/emailer?email=" + email + "&type=" + type
      : "/emailer?type=" + type;
    return url;
  },
  followers: (id) => {
    return "/" + id + "/followers?page=1";
  },
  followings: (id) => {
    return "/" + id + "/following?page=1";
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
