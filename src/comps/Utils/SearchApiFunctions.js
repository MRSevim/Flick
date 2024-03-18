const searchApi = {
  searchAll: async (query) => {
    const response = await fetch("/search/all?search=" + query, {
      method: "get",
    });

    return response;
  },
};

export default searchApi;
