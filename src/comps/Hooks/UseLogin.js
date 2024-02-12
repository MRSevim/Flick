import { useState } from "react";
import { useUserContext } from "../Contexts/UserContext";
import userApi from "../Utils/UserApiFunctions";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    const response = await userApi.login(username, password);
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem(
        "username",
        JSON.stringify({ username: json.username })
      );

      // update the user context
      setUser({ username: json.username });

      // update loading state
      setIsLoading(false);
    }
    return response;
  };

  return { login, isLoading, error };
};
