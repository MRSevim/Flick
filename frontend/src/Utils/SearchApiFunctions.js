const searchApi = {
  searchAll: async (query) => {
    const response = await fetch("/search/all?search=" + query);

    return response;
  },
  searchAdvanced: async (username, title, tags) => {
    const response = await fetch(
      "/search/advanced?username=" +
        username +
        "&title=" +
        title +
        "&tags=" +
        tags
    );

    return response;
  },
};

export default searchApi;
