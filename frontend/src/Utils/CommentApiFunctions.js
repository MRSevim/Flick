import { backendUrl } from "./HelperFuncs";

const commentApi = {
  comment: async (content, id) => {
    const response = await fetch(backendUrl + "/comment/" + id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    return response;
  },
  edit: async (content, articleId, commentId) => {
    const response = await fetch(backendUrl + "/comment/" + articleId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, id: commentId }),
    });

    return response;
  },
  delete: async (articleId, commentId, reasonOfDeletion) => {
    const response = await fetch(backendUrl + "/comment/" + articleId, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: commentId, reasonOfDeletion }),
    });

    return response;
  },
};
export default commentApi;
