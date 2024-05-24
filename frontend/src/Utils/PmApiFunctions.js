const pmApi = {
  getPms: async () => {
    const response = await fetch("/pms");

    return response;
  },
};

export default pmApi;
