"use server";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const sendPmCall = async (id, subject, message, userId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;
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
    return json.message;
  }

  revalidateTag("pms/sent/" + userId);
};

export const markAsReadCall = async (userId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;

  const response = await fetch(backendUrl + "/pms/read", {
    method: "POST",
    headers: {
      Cookie: authTokenCookieString,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    return json.message;
  }

  revalidateTag("pms/received/" + userId);
};
export const deleteManyCall = async (ids, type, userId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;

  const response = await fetch(backendUrl + "/pms/deleteMany", {
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

  revalidateTag("pms/" + type + "/" + userId);
};
export const deleteCall = async (id, type, userId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;
  const response = await fetch(backendUrl + "/pms/" + id, {
    method: "DELETE",
    headers: {
      Cookie: authTokenCookieString,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    return json.message;
  }

  revalidateTag("pms/" + type + "/" + userId);
};
