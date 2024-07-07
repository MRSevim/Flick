export const login = async (formData) => {
  const { username, password, rememberMe } = Object.fromEntries(formData);

  const rememberMeBool = rememberMe === "true";
  const response = await fetch("/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      isGoogleLogin: false,
      googleCredential: null,
      rememberMe: rememberMeBool,
    }),
  });

  const json = await response.json();

  console.log(json);
};
