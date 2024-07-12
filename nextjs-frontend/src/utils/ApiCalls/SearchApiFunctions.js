"use server";
import { backendUrl } from "../HelperFuncs";

export const searchAll = async (query) => {
  const response = await fetch(backendUrl + "/search/all?search=" + query);
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
