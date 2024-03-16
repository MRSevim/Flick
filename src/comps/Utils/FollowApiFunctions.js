const followApi = {
  follow: async (id) => {
    const response = await fetch("/follow/" + id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
};
export default followApi;
