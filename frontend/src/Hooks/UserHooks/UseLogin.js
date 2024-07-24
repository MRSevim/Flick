import { useState } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import userApi from "../../Utils/UserApiFunctions";
import ls from "localstorage-slim";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();

  const login = async (
    username,
    password,
    isGoogleLogin,
    googleCredential,
    rememberMe
  ) => {
    setIsLoading(true);
    setError(null);

    const response = await userApi.login(
      username,
      password,
      isGoogleLogin,
      googleCredential,
      rememberMe
    );
    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
    }
    if (response.ok) {
      if (rememberMe) {
        // save the user to local storage if rememberMe is true

        ls.set("user", JSON.stringify(json), {
          ttl: 30 * 24 * 60 * 60, // 30 days,
        });
      } else {
        //else save to session storage

        sessionStorage.setItem("user", JSON.stringify(json));
      }

      // update the user context
      setUser(json);
    }
    // update loading state
    setIsLoading(false);
    return response;
  };

  return { login, isLoading, error, setError };
};
