"use server";
import { envVariables } from "../HelperFuncs";
import { notFound } from "next/navigation";
const backendUrl = envVariables.backendUrl;

export const searchAllCall = async (query, searchPage) => {
  const response = await fetch(backendUrl + "/search/all?search=" + query, {
    cache: "no-store",
  });
  const json = await response.json();

  if (!response.ok) {
    if (searchPage) {
      notFound();
    }
    return { error: json.message };
  }
  return { json };
};

export const searchAdvancedCall = async (username, title, tags) => {
  const response = await fetch(
    backendUrl +
      "/search/advanced?username=" +
      username +
      "&title=" +
      title +
      "&tags=" +
      tags,
    {
      cache: "no-store",
    }
  );

  const json = await response.json();

  if (!response.ok) {
    notFound();
  }

  return json;
};
