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
};
export default userApi;
