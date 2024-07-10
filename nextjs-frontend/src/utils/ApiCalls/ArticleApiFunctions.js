import { backendUrl } from "../HelperFuncs";
const articleApi = {
  create: async (title, content, isDraft, tags, image) => {
    const response = await fetch(backendUrl + "/article/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content, isDraft, tags, image }),
    });

    return response;
  },
  update: async (title, content, isDraft, id, tags, image) => {
    const response = await fetch(backendUrl + "/article/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content, isDraft, tags, image }),
    });

    return response;
  },
  delete: async (id, reasonOfDeletion) => {
    const response = await fetch(backendUrl + "/article/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ reasonOfDeletion }),
    });

    return response;
  },
  deleteMany: async (ids) => {
    const response = await fetch(backendUrl + "/article/deleteMany", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ids }),
    });

    return response;
  },
  getArticle: async (id, isDraft) => {
    const url = isDraft ? "/article/draft/" : "/article/";

    const response = await fetch(backendUrl + url + id, {
      credentials: "include",
    });

    return response;
  },
  getArticles: async (id, page, isDraft, advancedSearch, title, tags) => {
    let url = !isDraft
      ? "/article/user/" + id + "?page=" + page
      : "/article/draft?page=" + page;

    if (advancedSearch) {
      const addition = "&title=" + title + "&tags=" + tags;
      url = url + addition;
    }

    const response = await fetch(backendUrl + url, { credentials: "include" });

    return response;
  },
  getSimilar: async (id) => {
    const response = await fetch(backendUrl + "/article/similar/" + id, {
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
};

export default articleApi;
