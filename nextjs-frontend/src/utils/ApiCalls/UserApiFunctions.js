"use server";
import { envVariables } from "../HelperFuncs";
const backendUrl = envVariables.backendUrl;
import { cookies } from "next/headers";

export const signupCall = async (token, prevState, formData) => {
  const url = backendUrl + "/user/register/" + (token ? token : "");

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

  const response = await fetch(url, {
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

export const updateUserCall = async (
  username,
  email,
  password,
  newPassword,
  image
) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;
  const response = await fetch(backendUrl + "/user/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: authTokenCookieString,
    },
    body: JSON.stringify({ username, email, password, newPassword, image }),
  });

  const json = await response.json();

  if (!response.ok) {
    return {
      error: json.message,
    };
  }
  const {
    message,
    username: _username,
    _id,
    isGoogleLogin,
    image: _image,
    role,
  } = json;

  const userObject = {
    username: _username,
    _id,
    isGoogleLogin,
    image: _image,
    role,
  };

  return { successMessage: message, userObject };
};

export const generateModLinkCall = async () => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;
  const response = await fetch(backendUrl + "/user/generate-mod-link", {
    method: "POST",
    headers: {
      Cookie: authTokenCookieString,
    },
  });
  const json = await response.json();

  if (!response.ok) {
    return { error: json.message };
  }
  return { token: json.token };
};

export const deleteAccountCall = async (formData) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;
  const password = formData.get("password");

  const response = await fetch(backendUrl + "/user/profile", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: authTokenCookieString,
    },
    body: JSON.stringify({ password }),
  });

  const json = await response.json();

  if (!response.ok) {
    return { error: json.message };
  }
  return { error: null };
};

export const banUserCall = async (id, reasonOfBan) => {
  const authTokenCookieString = "jwt=" + cookies().get("jwt").value;
  const response = await fetch(backendUrl + "/user/ban/" + id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: authTokenCookieString,
    },

    body: JSON.stringify({ reasonOfBan }),
  });

  const json = await response.json();
  if (!response.ok) {
    return { error: json.message };
  }
  return { error: null };
};

/* const userApi = {
  toggleUserVariables: async (type) => {
    const response = await fetch(backendUrl + "/user/toggle/" + type, {
      method: "PUT",
    });

    return response;
  },


};
export default userApi; */
