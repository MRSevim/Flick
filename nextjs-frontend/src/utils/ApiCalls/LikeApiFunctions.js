import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;

const likeApi = {
  like: async (id) => {
    const response = await fetch(backendUrl + "/like/" + id, {
      method: "POST",
    });

    return response;
  },
  getMostLiked: async (time) => {
    const response = await fetch(backendUrl + "/like/getMostLiked/" + time);

    return response;
  },
};
export default likeApi;