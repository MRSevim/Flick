import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;

const notificationApi = {
  getNotifications: async () => {
    const response = await fetch(backendUrl + "/notifications");

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
