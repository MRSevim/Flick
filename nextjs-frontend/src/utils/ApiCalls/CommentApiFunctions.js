"use server";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const commentCall = async (content, id, articleOwnerId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;

  const response = await fetch(backendUrl + "/comment/" + id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: authTokenCookieString,
    },
    body: JSON.stringify({ content }),
  });

  const json = await response.json();
  if (!response.ok) {
    return json.message;
  }

  revalidateTag("article/" + id);
  revalidateTag("notifications/" + articleOwnerId);

  return;
};
export const editCommentCall = async (content, articleId, commentId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + "/comment/" + articleId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: authTokenCookieString,
    },
    body: JSON.stringify({ content, id: commentId }),
  });

  const json = await response.json();
  if (!response.ok) {
    return json.message;
  }

  revalidateTag("article/" + articleId);

  return;
};
export const deleteCommentCall = async (
  articleId,
  commentId,
  reasonOfDeletion,
  articleOwnerId,
  commentOwnerId
) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + "/comment/" + articleId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: authTokenCookieString,
    },
    body: JSON.stringify({ id: commentId, reasonOfDeletion }),
  });

  const json = await response.json();
  if (!response.ok) {
    return json.message;
  }

  revalidateTag("article/" + articleId);
  revalidateTag("notifications/" + articleOwnerId);
  if (reasonOfDeletion) {
    revalidateTag("notifications/" + commentOwnerId);
  }

  return;
};
