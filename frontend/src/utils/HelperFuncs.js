import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

export const extractExcerptFromHTML = (html) => {
  const stripHtml = html.replace(/<[^>]*>?/gm, "");
  const words = stripHtml.split(/\s+/); // Split the text by whitespace
  const cutWords = words.slice(0, 100).join(" ");
  return cutWords;
};

export const createShortenedTitle = (title, limit) => {
  const shortened = title.substring(0, limit);
  const threeDots = title.length > limit ? "..." : "";
  return shortened + threeDots;
};

export const redirectToImages = (src) => {
  return "/images" + src;
};

TimeAgo.addLocale(en);
export const timeAgo = new TimeAgo("en-US");

export function extractDate(datetimeStr) {
  return datetimeStr.split("T")[0];
}

export const getFirstPartOfPath = (pathname) => {
  return pathname.split("/")[1];
};
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const addDarkBg = (darkMode) => {
  return darkMode && "bg-dark-primary";
};

export const addLightOutlineBtn = (darkMode) => {
  return darkMode && "btn-outline-light";
};

export const getUnreadLength = (items) => {
  return items?.filter((items) => {
    return !items.read;
  })?.length;
};

export const confirmationWrapper = async (
  confirmation,
  returnNewConfirmation,
  setConfirmation,
  apiCall,
  okResponseFunc
) => {
  setConfirmation((prev) => returnNewConfirmation(prev));
  confirmation.ref.current.show();
  const call = async (reason) => {
    setConfirmation((prev) => ({ ...prev, isLoading: true }));
    const error = await apiCall(reason);

    if (!error) {
      confirmation.ref.current.hide();
      okResponseFunc();
    }
    setConfirmation((prev) => ({ ...prev, isLoading: false }));
  };
  setConfirmation((prev) => ({ ...prev, functionToRun: call }));
};

export const envVariables = {
  email: process.env.NEXT_PUBLIC_EMAIL,
  websiteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
  googleId: process.env.GOOGLE_CLIENT_ID,
  backendUrl: process.env.BACKEND_URL,
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
  frontendUrl: process.env.FRONTEND_URL,
  defaultUserImage: process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE,
  defaultArticleImage: process.env.NEXT_PUBLIC_DEFAULT_ARTICLE_IMAGE,
};

export const authenticatedRoutes = [
  "/my-profile",
  "/drafts",
  "/pms",
  "/edit",
  "/settings",
];

export const Tags = [
  "Nature",
  "Philosophy",
  "Science",
  "Technology",
  "History",
  "Art",
  "Literature",
  "Music",
  "Film",
  "Politics",
  "Travel",
  "Health",
  "Fitness",
  "Food",
  "Fashion",
  "Education",
  "Business",
  "Religion",
];
