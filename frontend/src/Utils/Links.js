import { envVariables } from "./HelperFuncs";
const links = {
  pms: (type) => "/pms?open=false&page=1&type=" + type,
  pmsWithoutParams: "/pms",
  tocAndPrivacyPolicy: "/toc-and-privacy-policy",
  settings: "/settings",
  sendPm: (username, id) => {
    return `/pms?open=true&page=1&type=sent&username=${username}&_id=${id}`;
  },
  homepage: "/",
  mostLiked: (time) => "/mostLiked/" + time,
  createAnArticle: "/create-an-article",
  myProfile: "/my-profile",
  about: "/about",
  login: "/login",
  signup: (token) => {
    if (token) {
      return "/sign-up?token=" + token;
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
  emailerWithoutParams: "/emailer",
  followsWithoutPage: (id, type) => {
    return "/user/" + id + "/" + type;
  },
  follows: (id, type, page) => {
    return "/user/" + id + "/" + type + "?page=" + page;
  },
  publicUser: (id) => {
    return "/user/" + id;
  },
  userString: "/user",
  article: (id) => {
    return "/article/" + id;
  },
  articleString: "/article",
  allArticles: (id) => {
    return "/articles/" + id + "?page=1";
  },
  allArticlesWithoutPage: (id) => {
    return "/articles/" + id;
  },
  articlesString: "/articles",
  allDrafts: (id) => {
    return "/drafts/" + id + "?page=1";
  },
  draftsString: "/drafts",
  edit: (id, isDraft) => {
    return "/edit/" + id + "?isDraft=" + isDraft;
  },
  editString: "/edit",
  search: (param) => {
    return "/search?q=" + param;
  },
  searchWithoutParam: "/search",
  tag: (tag) => {
    return "/search?advancedSearch=true&username=&title=&tags=" + tag;
  },
};

export default links;
