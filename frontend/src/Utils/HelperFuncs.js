export const getExcerpt = (content, wordLimit = 100) => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = content;

  let wordCount = 0;
  let reachedWordLimit = false;

  const traverseNodes = (node) => {
    if (reachedWordLimit) return "";

    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent
        .split(/\s+/)
        .filter((word) => word.length > 0);
      if (wordCount + words.length > wordLimit) {
        const remainingWords = wordLimit - wordCount;
        const truncatedText = words.slice(0, remainingWords).join(" ");
        wordCount = wordLimit;
        reachedWordLimit = true;
        return truncatedText;
      } else {
        wordCount += words.length;
        return node.textContent;
      }
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      let openingTag = `<${node.nodeName.toLowerCase()}`;
      for (const attr of node.attributes) {
        openingTag += ` ${attr.name}="${attr.value}"`;
      }
      openingTag += ">";

      let innerContent = "";
      for (const child of node.childNodes) {
        innerContent += traverseNodes(child);
        if (reachedWordLimit) break;
      }

      let closingTag = `</${node.nodeName.toLowerCase()}>`;

      return openingTag + innerContent + closingTag;
    }

    return "";
  };

  const truncatedHTML = traverseNodes(tempElement);

  return truncatedHTML;
};

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
  env: process.env.REACT_APP_ENV,
  email: process.env.REACT_APP_EMAIL,
  websiteName: process.env.REACT_APP_WEBSITE_NAME,
  googleId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  appUrl: process.env.REACT_APP_URL,
  publicUrl: process.env.PUBLIC_URL,
  defaultUserImage: process.env.REACT_APP_DEFAULT_USER_IMAGE,
  defaultArticleImage: process.env.REACT_APP_DEFAULT_ARTICLE_IMAGE,
};

export const backendUrl =
  envVariables.env === "development" ? "" : envVariables.appUrl + "/api";
