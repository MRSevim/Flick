const followApi = {
  follow: async (id) => {
    const response = await fetch("/follow/" + id, {
      method: "POST",
    });

    return response;
  },
  getFollows: async (id, type) => {
    const response = await fetch("/follow/" + type + "/" + id, {
      method: "GET",
    });

    return response;
  },
};
export default followApi;
