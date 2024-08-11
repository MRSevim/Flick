"use server";
import { envVariables } from "../HelperFuncs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import links from "../Links";
import { revalidateTag } from "next/cache";
const backendUrl = envVariables.backendUrl;

export const sendEmailCall = async (email, type) => {
  const response = await fetch(backendUrl + "/email/" + type, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const json = await response.json();

  if (!response.ok) {
    return { error: json.message };
  }

  return { successMessage: json.message };
};

export const verifyEmailTokenCall = async (token) => {
  const response = await fetch(backendUrl + "/email/verify/" + token, {
    method: "PUT",
  });
  const json = await response.json();

  if (!response.ok) {
    return json.message;
  }

  const userFromCookies = cookies().get("user")?.value
    ? JSON.parse(cookies().get("user")?.value)
    : undefined;

  if (userFromCookies) {
    revalidateTag("profile/" + userFromCookies._id);
    redirect(links.myProfile);
  } else {
    redirect(links.login);
  }
};
