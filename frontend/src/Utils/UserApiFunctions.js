const userApi = {
  login: async (
    username,
    password,
    isGoogleLogin,
    googleCredential,
    rememberMe
  ) => {
    const response = await fetch("/user/login", {
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

    return response;
  },
  signup: async (username, email, password, token) => {
    const url = "/user/register/" + (token ? token : "");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    return response;
  },
  logout: async () => {
    const response = await fetch("/user/logout", {
      method: "POST",
    });

    return response;
  },
  getProfile: async () => {
    const response = await fetch("/user/profile");

    return response;
  },
  getPublicUser: async (param) => {
    const response = await fetch("/user/" + param);

    return response;
  },
  update: async (username, email, password, newPassword, image) => {
    const response = await fetch("/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, newPassword, image }),
    });

    return response;
  },
  delete: async (password) => {
    const response = await fetch("/user/profile", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    return response;
  },
  toggleUserVariables: async (type) => {
    const response = await fetch("/user/toggle/" + type, {
      method: "PUT",
    });

    return response;
  },
};
export default userApi;
