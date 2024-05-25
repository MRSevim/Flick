const pmApi = {
  getPms: async () => {
    const response = await fetch("/pms");

    return response;
  },
  sendPm: async (id, subject, message) => {
    const response = await fetch("/pms/send/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });

    return response;
  },
  delete: async (id) => {
    const response = await fetch("/pms/" + id, {
      method: "DELETE",
    });

    return response;
  },
  deleteMany: async (ids) => {
    const response = await fetch("/pms/deleteMany", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    return response;
  },
};

export default pmApi;
