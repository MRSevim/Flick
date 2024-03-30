const searchApi = {
  searchAll: async (query) => {
    const response = await fetch("/search/all?search=" + query);

    return response;
  },
};

export default searchApi;
