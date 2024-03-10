const likeApi = {
  like: async (id) => {
    const response = await fetch("/like/" + id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
  getMostLiked: async (time) => {
    const response = await fetch("/like/get" + time + "ly", {
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
};
export default likeApi;
