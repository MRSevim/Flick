const followApi = {
  follow: async (id) => {
    const response = await fetch("/follow/" + id, {
      method: "POST",
    });

    return response;
  },
  getFollows: async (id, type, page) => {
    const response = await fetch(
      "/follow/follows/" + id + "?type=" + type + "&page=" + page
    );

    return response;
  },
};
export default followApi;
