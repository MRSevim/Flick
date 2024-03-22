const notificationApi = {
  getNotifications: async () => {
    const response = await fetch("/notifications");

    return response;
  },
};

export default notificationApi;
