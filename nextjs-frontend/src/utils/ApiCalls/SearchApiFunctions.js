"use server";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;

export const searchAll = async (query) => {
  const response = await fetch(backendUrl + "/search/all?search=" + query, {
    cache: "no-store",
  });
  const json = await response.json();

  if (!response.ok) {
    return { error: json.message };
  }
  return json;
};
/* const searchApi = {
  searchAdvanced: async (username, title, tags) => {
    const response = await fetch(
      backendUrl +
        "/search/advanced?username=" +
        username +
        "&title=" +
        title +
        "&tags=" +
        tags
    );

    return response;
  },
};

export default searchApi; */
