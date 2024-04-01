const articleApi = {
  create: async (title, content, isDraft, tags) => {
    const response = await fetch("/article/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, isDraft, tags }),
    });

    return response;
  },
  update: async (title, content, isDraft, id, tags) => {
    const response = await fetch("/article/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, isDraft, tags }),
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
  getArticle: async (id, isDraft) => {
    const url = !isDraft ? "/article/" : "/article/draft/";
    const response = await fetch(url + id);

    return response;
  },
  getArticles: async (id, page, isDraft) => {
    const url = !isDraft
      ? "/article/user/" + id + "?page="
      : "/article/draft?page=";

    const response = await fetch(url + page);

    return response;
  },
};

export default articleApi;
