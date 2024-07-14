"use server";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;

export const signupCall = async (token, prevState, formData) => {
  const url = "/user/register/" + (token ? token : "");

  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData?.get("confirmPassword");
  const accepted = formData.get("accepted") === "on";

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  if (!accepted) {
    return {
      error:
        "You have to agree to Terms of Conditions (ToC) and Privacy Policy to create an account",
    };
  }

  const response = await fetch(backendUrl + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const json = await response.json();

  if (!response.ok) {
    return {
      error: json.message,
    };
  }
  return {
    successMessage: json.message,
  };
};
