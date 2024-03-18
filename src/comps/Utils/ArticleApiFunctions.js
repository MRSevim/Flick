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
    });

    return response;
  },
  comment: async (content, id) => {
    const response = await fetch("/article/comment/" + id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    return response;
  },
  deleteMany: async (ids) => {
    const response = await fetch("/article/deleteMany", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    return response;
  },
  getArticle: async (id) => {
    const response = await fetch("/article/" + id, {});

    return response;
  },
  getArticles: async (id, page) => {
    const response = await fetch("/article/user/" + id + "?page=" + page, {});

    return response;
  },
  getDraft: async (id) => {
    const response = await fetch("/article/draft/" + id, {});

    return response;
  },
  getDrafts: async (page) => {
    const response = await fetch("/article/draft?page=" + page, {});

    return response;
  },
};

export default articleApi;
