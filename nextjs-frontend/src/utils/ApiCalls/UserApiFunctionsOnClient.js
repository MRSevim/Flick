import { authenticatedRoutes, getFirstPartOfPath } from "../HelperFuncs";
import links from "../Links";

export const loginCall = async (
  { isGoogleLogin, googleCredential, rememberMe },
  formData
) => {
  const username = formData?.get("username");
  const password = formData?.get("password");

  const response = await fetch("/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      isGoogleLogin,
      googleCredential,
      rememberMe,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    return { error: json.message };
  }

  return { user: json };
};

export const logoutCall = async (path, router) => {
  const response = await fetch("/api/user/logout", {
    method: "POST",
  });
  const json = await response.json();

  if (!response.ok) {
    return json.message;
  }
  const firstPart = "/" + getFirstPartOfPath(path);

  if (authenticatedRoutes.includes(firstPart)) {
    router.push(links.homepage);
  }
  return;
};
