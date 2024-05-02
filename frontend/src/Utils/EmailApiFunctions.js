const emailApi = {
  verifyEmailToken: async (token) => {
    const response = await fetch("/email/verify/" + token, {
      method: "PUT",
    });
    return response;
  },
  resendVerificationEmail: async (email) => {
    const response = await fetch("/email/resend-verification-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return response;
  },
};
export default emailApi;
