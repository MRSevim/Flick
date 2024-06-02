const emailApi = {
  verifyEmailToken: async (token) => {
    const response = await fetch("/email/verify/" + token, {
      method: "PUT",
    });
    return response;
  },
  sendEmail: async (email, type) => {
    const response = await fetch("/email/" + type, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return response;
  },
};
export default emailApi;
