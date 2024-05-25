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
