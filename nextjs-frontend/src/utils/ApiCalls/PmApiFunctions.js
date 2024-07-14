import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;

const pmApi = {
  getPms: async (page, type) => {
    const response = await fetch(backendUrl + `/pms?page=${page}&type=${type}`);

    return response;
  },
  getReceivedLength: async () => {
    const response = await fetch(backendUrl + "/pms/receivedLength");

    return response;
  },
  sendPm: async (id, subject, message) => {
    const response = await fetch(backendUrl + "/pms/send/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });

    return response;
  },
  delete: async (id) => {
    const response = await fetch(backendUrl + "/pms/" + id, {
      method: "DELETE",
    });

    return response;
  },
  deleteMany: async (ids) => {
    const response = await fetch(backendUrl + "/pms/deleteMany", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    return response;
  },
  markAsRead: async () => {
    const response = await fetch(backendUrl + "/pms/read", {
      method: "POST",
    });

    return response;
  },
};

export default pmApi;
