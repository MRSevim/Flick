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
  newConfirmation,
  setConfirmation,
  setGlobalError,
  setIsLoading,
  func
) => {
  confirmation.ref.current.show();

  setConfirmation(newConfirmation);
  setGlobalError(null);

  const isConfirmed = await confirmation.confirmed;

  if (isConfirmed) {
    setIsLoading(true);

    const response = await func();
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }
    setIsLoading(false);

    return response;
  } else {
    return;
  }
};
