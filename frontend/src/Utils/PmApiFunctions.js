import { backendUrl } from "./HelperFuncs";

const pmApi = {
  getPms: async (page, type) => {
    const response = await fetch(
      backendUrl + `/pms?page=${page}&type=${type}`,
      { credentials: "include" }
    );

    return response;
  },
  getReceivedLength: async () => {
    const response = await fetch(backendUrl + "/pms/receivedLength", {
      credentials: "include",
    });

    return response;
  },
  sendPm: async (id, subject, message) => {
    const response = await fetch(backendUrl + "/pms/send/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ subject, message }),
    });

    return response;
  },
  delete: async (id) => {
    const response = await fetch(backendUrl + "/pms/" + id, {
      method: "DELETE",
      credentials: "include",
    });

    return response;
  },
  deleteMany: async (ids) => {
    const response = await fetch(backendUrl + "/pms/deleteMany", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ids }),
    });

    return response;
  },
  markAsRead: async () => {
    const response = await fetch(backendUrl + "/pms/read", {
      method: "POST",
      credentials: "include",
    });

    return response;
  },
};

export default pmApi;
