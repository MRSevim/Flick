export const extractExcerptFromHTML = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = div.textContent || div.innerText || "";
  const words = text.split(/\s+/); // Split the text by whitespace
  const cutWords = words.slice(0, 100).join(" ");
  return cutWords;
};

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function getClientSideCookie(cname) {
  if (typeof window !== "undefined") {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}
export const getDarkModeFromCookies = (darkMode) => {
  return darkMode === "true";
};
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const addDarkBg = (darkMode) => {
  return darkMode && "bg-dark-primary";
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
    const response = await apiCall(reason);

    if (response && response.ok) {
      confirmation.ref.current.hide();
      okResponseFunc();
    }
    setConfirmation((prev) => ({ ...prev, isLoading: false }));
  };
  setConfirmation((prev) => ({ ...prev, functionToRun: call }));
};
export const envVariables = {
  email: process.env.EMAIL,
  websiteName: process.env.WEBSITE_NAME,
  googleId: process.env.GOOGLE_CLIENT_ID,
  backendUrl: process.env.BACKEND_URL,
  publicUrl: process.env.PUBLIC_URL,
  defaultUserImage: process.env.DEFAULT_USER_IMAGE,
  defaultArticleImage: process.env.DEFAULT_ARTICLE_IMAGE,
};
