const notificationApi = {
  getNotifications: async () => {
    const response = await fetch("/notifications");

    return response;
  },
  markAsRead: async () => {
    const response = await fetch("/notifications/read", { method: "POST" });

    return response;
  },
  clearNotifications: async () => {
    const response = await fetch("/notifications/clear", { method: "POST" });

    return response;
  },
};

export default notificationApi;
