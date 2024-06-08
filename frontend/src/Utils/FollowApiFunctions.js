import { backendUrl } from "./HelperFuncs";

const followApi = {
  follow: async (id) => {
    const response = await fetch(backendUrl + "/follow/" + id, {
      method: "POST",
    });

    return response;
  },
  getFollows: async (id, type, page) => {
    const response = await fetch(
      backendUrl + "/follow/follows/" + id + "?type=" + type + "&page=" + page
    );

    return response;
  },
};
export default followApi;
