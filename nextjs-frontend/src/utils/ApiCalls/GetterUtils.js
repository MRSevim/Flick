/* put all your get requests here, doing it like this does not expose api endpoint,
if you need to use get fetch on client comp, create new file */

import "server-only";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;

export const getProfileCall = async () => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;
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

export const getPublicUserCall = async (param) => {
  const response = await fetch(backendUrl + "/user/" + param, {
    cache: "no-store",
  });
  const json = await response.json();
  if (!response.ok) {
    notFound();
  }

  return { json };
};
export const getFollowsCall = async (id, type, page) => {
  const response = await fetch(
    backendUrl + "/follow/follows/" + id + "?type=" + type + "&page=" + page,
    { cache: "no-store" }
  );

  const json = await response.json();

  if (!response.ok) {
    notFound();
  }

  return { json };
};
