const commentApi = {
  comment: async (content, id) => {
    const response = await fetch("/comment/" + id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    return response;
  },
  edit: async (content, articleId, commentId) => {
    const response = await fetch("/comment/" + articleId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, id: commentId }),
    });

    return response;
  },
  delete: async (articleId, commentId) => {
    const response = await fetch("/comment/" + articleId, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: commentId }),
    });

    return response;
  },
};
export default commentApi;
