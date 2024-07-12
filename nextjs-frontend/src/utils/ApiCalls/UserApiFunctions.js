import { backendUrl } from "../HelperFuncs";

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

export const logoutCall = async () => {
  const response = await fetch("/api/user/logout", {
    method: "POST",
  });
  const json = await response.json();

  if (!response.ok) {
    return json.message;
  }
  return;
};

const userApi = {
  signup: async (username, email, password, token) => {
    const url = "/user/register/" + (token ? token : "");
    const response = await fetch(backendUrl + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    return response;
  },

  getProfile: async () => {
    const response = await fetch(backendUrl + "/user/profile", {
      credentials: "include",
    });

    return response;
  },
  getPublicUser: async (param) => {
    const response = await fetch(backendUrl + "/user/" + param);

    return response;
  },
  update: async (username, email, password, newPassword, image) => {
    const response = await fetch(backendUrl + "/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password, newPassword, image }),
    });

    return response;
  },
  delete: async (password) => {
    const response = await fetch(backendUrl + "/user/profile", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    return response;
  },
  toggleUserVariables: async (type) => {
    const response = await fetch(backendUrl + "/user/toggle/" + type, {
      method: "PUT",
      credentials: "include",
    });

    return response;
  },
  ban: async (id, reasonOfBan) => {
    const response = await fetch(backendUrl + "/user/ban/" + id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ reasonOfBan }),
    });

    return response;
  },
  generateModLink: async () => {
    const response = await fetch(backendUrl + "/user/generate-mod-link", {
      method: "POST",

      credentials: "include",
    });

    return response;
  },
};
export default userApi;
