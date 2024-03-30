const likeApi = {
  like: async (id) => {
    const response = await fetch("/like/" + id, {
      method: "POST",
    });

    return response;
  },
  getMostLiked: async (time) => {
    const response = await fetch("/like/getMostLiked/" + time);

    return response;
  },
};
export default likeApi;
