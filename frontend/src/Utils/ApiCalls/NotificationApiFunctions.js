"use server";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const clearNotificationsCall = async (userId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + "/notifications/clear", {
    method: "POST",
    headers: { Cookie: authTokenCookieString },
  });

  const json = await response.json();

  if (!response.ok) {
    return { error: json.message };
  }

  revalidateTag("notifications/" + userId);
  return { error: null };
};

export const markAsReadCall = async (userId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + "/notifications/read", {
    method: "POST",
    headers: { Cookie: authTokenCookieString },
  });

  const json = await response.json();

  if (!response.ok) {
    return { error: json.message };
  }

  revalidateTag("notifications/" + userId);
  return { error: null };
};
