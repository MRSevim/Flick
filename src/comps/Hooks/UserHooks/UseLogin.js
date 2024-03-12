import { useState } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import userApi from "../../Utils/UserApiFunctions";
import ls from "localstorage-slim";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();

  const login = async (username, password, isGoogleLogin, googleCredential) => {
    setIsLoading(true);
    setError(null);

    const response = await userApi.login(
      username,
      password,
      isGoogleLogin,
      googleCredential
    );
    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
    }
    if (response.ok) {
      // save the user to local storage
      console.log(json);
      ls.set("user", JSON.stringify({ ...json }), {
        ttl: 30 * 24 * 60 * 60, // 30 days,
      });

      // update the user context
      setUser({ ...json });
    }
    // update loading state
    setIsLoading(false);
    return response;
  };

  return { login, isLoading, error, setError };
};
