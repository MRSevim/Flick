export const getFirstDiv = (content) => {
  const divs = content.split("</div>");
  const firstDiv = divs[0] + "</div>";
  if (firstDiv.length > 1000) {
    return firstDiv.substring(0, 1000);
  }
  return firstDiv;
};
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const addDarkBg = (darkMode) => {
  return darkMode && "bg-dark-primary";
};
