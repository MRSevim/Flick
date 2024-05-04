export const getFirstDiv = (content) => {
  const divs = content.split("</div>");
  const firstDiv = divs[0] + "</div>";

  return firstDiv;
};
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
