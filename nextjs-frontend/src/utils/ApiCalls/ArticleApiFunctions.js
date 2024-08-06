"use server";
import { envVariables } from "../HelperFuncs";
import { cookies } from "next/headers";
import { revalidateTag, revalidatePath } from "next/cache";
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
  revalidateTag("similar");

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
  revalidateTag("similar");
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
  revalidateTag("similar");
};
export const updateArticleCall = async (
  title,
  content,
  isDraft,
  id,
  tags,
  image
) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + "/article/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: authTokenCookieString,
    },

    body: JSON.stringify({ title, content, isDraft, tags, image }),
  });
  const json = await response.json();

  if (!response.ok) {
    return json.message;
  }

  revalidatePath("/", "layout");
};
