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

export const getPublicUserCall = async (id) => {
  const response = await fetch(backendUrl + "/user/" + id, {
    next: { tags: [id] },
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
    { next: { tags: [id] } }
  );

  const json = await response.json();

  if (!response.ok) {
    notFound();
  }

  return { json };
};
export const getArticlesCall = async (
  id,
  page,
  isDraft,
  advancedSearch,
  title,
  tags
) => {
  let url = !isDraft
    ? "/article/user/" + id + "?page=" + page
    : "/article/draft?page=" + page;

  if (advancedSearch) {
    const addition = "&title=" + title + "&tags=" + tags;
    url = url + addition;
  }
  const authTokenCookieString = "jwt=" + cookies().get("jwt")?.value;
  const response = await fetch(backendUrl + url, {
    headers: {
      Cookie: authTokenCookieString,
    },
    next: { tags: [id] },
  });

  const json = await response.json();

  if (!response.ok) {
    notFound();
  }

  return { json };
};
export const getMostLikedCall = async (time) => {
  const response = await fetch(backendUrl + "/like/getMostLiked/" + time);

  const json = await response.json();

  if (!response.ok) {
    notFound();
  }

  return { json };
};
export const getArticleCall = async (id, isDraft) => {
  const url = isDraft ? "/article/draft/" : "/article/";

  const response = await fetch(backendUrl + url + id, {
    next: { tags: ["article/" + id] },
  });

  const json = await response.json();

  if (!response.ok) {
    notFound();
  }

  return { json };
};
export const getSimilarCall = async (id) => {
  const response = await fetch(backendUrl + "/article/similar/" + id, {
    headers: { "Content-Type": "application/json" },
    next: { tags: ["similar"] },
  });

  const json = await response.json();

  if (!response.ok) {
    return { error: "Could not fetch similar articles" };
  }

  return { similar: json };
};

export const getReceivedLengthCall = async () => {
  const userFromCookies = JSON.parse(cookies().get("user").value);
  const userId = userFromCookies._id;
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;
  const response = await fetch(backendUrl + "/pms/receivedLength", {
    headers: { Cookie: authTokenCookieString },
    /*won't be needed? next: { tags: ["pms/received/" + userId] }, */
  });

  const json = await response.json();

  if (!response.ok) {
    return { error: json.message };
  }
  return { json };
};

export const getNotificationsCall = async () => {
  const userFromCookies = JSON.parse(cookies().get("user").value);
  const userId = userFromCookies._id;
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;
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

export const getPmsCall = async (page, type) => {
  const userFromCookies = JSON.parse(cookies().get("user").value);
  const userId = userFromCookies._id;
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;
  const response = await fetch(backendUrl + `/pms?page=${page}&type=${type}`, {
    headers: { Cookie: authTokenCookieString },
    next: { tags: ["pms/" + type + "/" + userId] },
  });

  const json = await response.json();

  if (!response.ok) {
    notFound();
  }
  return { json };
};
