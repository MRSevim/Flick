const followApi = {
  follow: async (id) => {
    const response = await fetch("/follow/" + id, {
      method: "POST",
    });

    return response;
  },
};
export default followApi;
