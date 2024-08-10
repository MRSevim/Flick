"use server";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const likeCall = async (id) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + "/like/" + id, {
    method: "POST",
    headers: {
      Cookie: authTokenCookieString,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    return json.message;
  }

  revalidatePath("/", "layout");
};
