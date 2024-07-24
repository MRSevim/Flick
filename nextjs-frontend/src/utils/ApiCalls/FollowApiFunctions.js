"use server";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const followCall = async (id, loggedInId) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;
  const response = await fetch(backendUrl + "/follow/" + id, {
    method: "POST",
    headers: {
      Cookie: authTokenCookieString,
    },
  });
  const json = await response.json();

  if (!response.ok) {
    return { error: json.message };
  }

  revalidateTag(id);
  revalidateTag(loggedInId);

  return { error: null };
};
