import { backendUrl } from "./HelperFuncs";

const notificationApi = {
  getNotifications: async () => {
    const response = await fetch(backendUrl + "/notifications", {
      credentials: "include",
    });

    return response;
  },
  markAsRead: async () => {
    const response = await fetch(backendUrl + "/notifications/read", {
      method: "POST",
    });

    return response;
  },
  clearNotifications: async () => {
    const response = await fetch(backendUrl + "/notifications/clear", {
      method: "POST",
    });

    return response;
  },
};

export default notificationApi;
