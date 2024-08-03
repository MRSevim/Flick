"use server";
import { envVariables } from "../HelperFuncs";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
const backendUrl = envVariables.backendUrl;

export const createArticleCall = async (
  title,
  content,
  isDraft,
  tags,
  image,
  userId
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

  revalidateTag(userId);

  return { error: null };
};

export const deleteArticleCall = async (id, reasonOfDeletion, userId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + "/article/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: authTokenCookieString,
    },

    body: JSON.stringify({ reasonOfDeletion }),
  });

  const json = await response.json();
  if (!response.ok) {
    return json.message;
  }

  revalidateTag(userId);
};

export const deleteManyCall = async (ids, userId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + "/article/deleteMany", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: authTokenCookieString,
    },

    body: JSON.stringify({ ids }),
  });

  const json = await response.json();
  if (!response.ok) {
    return json.message;
  }

  revalidateTag(userId);
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


  },

}; */
