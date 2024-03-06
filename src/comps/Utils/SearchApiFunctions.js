const searchApi = {
  searchAll: async (query) => {
    const response = await fetch("/search/all?search=" + query, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
};

export default searchApi;
