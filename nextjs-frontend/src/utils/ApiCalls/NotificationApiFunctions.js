"use server";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const getNotificationsCall = async (userId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + "/notifications", {
    headers: { Cookie: authTokenCookieString },
    next: { tags: ["notifications/" + userId] },
  });

  const json = await response.json();

  if (!response.ok) {
    return { error: json.message };
  }
  return { json };
};
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
/* const notificationApi = {

  markAsRead: async () => {
    const response = await fetch(backendUrl + "/notifications/read", {
      method: "POST",
    });

    return response;
  },
 
};

export default notificationApi;
 */
