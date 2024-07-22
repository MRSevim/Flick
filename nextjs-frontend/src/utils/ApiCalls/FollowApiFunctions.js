"use server";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import links from "../Links";

export const followCall = async (id) => {
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

  revalidatePath(links.publicUser(id));
  return { error: null };
};
