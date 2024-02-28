const articleApi = {
  create: async (title, content, isDraft) => {
    const response = await fetch("/article/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, isDraft }),
    });

    return response;
  },
  update: async (title, content, isDraft, id) => {
    const response = await fetch("/article/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, isDraft }),
    });

    return response;
  },
  delete: async (id) => {
    const response = await fetch("/article/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
  getArticle: async (id) => {
    const response = await fetch("/article/" + id, {
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
  getArticles: async (id) => {
    const response = await fetch("/article/user/" + id, {
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
  getDraft: async (id) => {
    const response = await fetch("/article/draft/" + id, {
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
  getDrafts: async () => {
    const response = await fetch("/article/draft", {
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
};

export default articleApi;
