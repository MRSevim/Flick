"use server";
import { envVariables } from "../HelperFuncs";
import { cookies } from "next/headers";
const backendUrl = envVariables.backendUrl;

export const createArticleCall = async (
  title,
  content,
  isDraft,
  tags,
  image
) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + "/article/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: authTokenCookieString,
    },

    body: JSON.stringify({ title, content, isDraft, tags, image }),
  });
  const json = await response.json();
  if (!response.ok) {
    return { error: json.message };
  }
  return { error: null };
};
/* const articleApi = {

  update: async (title, content, isDraft, id, tags, image) => {
    const response = await fetch(backendUrl + "/article/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ title, content, isDraft, tags, image }),
    });

    return response;
  },
  delete: async (id, reasonOfDeletion) => {
    const response = await fetch(backendUrl + "/article/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ reasonOfDeletion }),
    });

    return response;
  },
  deleteMany: async (ids) => {
    const response = await fetch(backendUrl + "/article/deleteMany", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ ids }),
    });

    return response;
  },
  getArticle: async (id, isDraft) => {
    const url = isDraft ? "/article/draft/" : "/article/";

    const response = await fetch(backendUrl + url + id);

    return response;
  },

  },
  getSimilar: async (id) => {
    const response = await fetch(backendUrl + "/article/similar/" + id, {
      headers: { "Content-Type": "application/json" },
    });

    return response;
  },
}; */
