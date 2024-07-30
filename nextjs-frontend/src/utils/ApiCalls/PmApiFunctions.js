"use server";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const sendPmCall = async (id, subject, message) => {
  const userFromCookies = JSON.parse(cookies().get("user")?.value);
  const userId = userFromCookies._id;
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + "/pms/send/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: authTokenCookieString,
    },
    body: JSON.stringify({ subject, message }),
  });

  const json = await response.json();

  if (!response.ok) {
    return { error: json.message };
  }

  revalidateTag("pms/sent" + userId);
  revalidateTag("pms/received" + id);
  return { error: null };
};

/* const pmApi = {
 

  delete: async (id) => {
    const response = await fetch(backendUrl + "/pms/" + id, {
      method: "DELETE",
    });

    return response;
  },
  deleteMany: async (ids) => {
    const response = await fetch(backendUrl + "/pms/deleteMany", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    return response;
  },
  markAsRead: async () => {
    const response = await fetch(backendUrl + "/pms/read", {
      method: "POST",
    });

    return response;
  },
};

export default pmApi; */
