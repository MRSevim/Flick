const userApi = {
  login: async (username, password) => {
    const response = await fetch("/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    return response;
  },
  signup: async (username, email, password) => {
    const response = await fetch("/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    return response;
  },
  logout: async () => {
    const response = await fetch("/user/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
  getProfile: async () => {
    const response = await fetch("/user/profile", {
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
  getPublicUser: async (param) => {
    const response = await fetch("/user/profile/" + param, {
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
  update: async (username, email, password) => {
    const response = await fetch("/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
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
};
export default userApi;
