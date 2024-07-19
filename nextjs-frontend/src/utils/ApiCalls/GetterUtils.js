/* put all your get requests here, doing it like this does not expose api endpoint,
if you need to use get fetch on client comp, create new file */

import "server-only";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;
const authTokenCookieString = "jwt=" + cookies().get("jwt").value;

export const getProfileCall = async () => {
  const response = await fetch(backendUrl + "/user/profile", {
    cache: "no-store",
    headers: {
      Cookie: authTokenCookieString,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    notFound();
  }

  return { json };
};
