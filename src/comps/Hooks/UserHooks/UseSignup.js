import { useState } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import userApi from "../../Utils/UserApiFunctions";
import ls from "localstorage-slim";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();

  const signup = async (username, email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await userApi.signup(username, email, password);
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
    }
    if (response.ok) {
      // save the user to local storage
      ls.set(
        "user",
        JSON.stringify({ username: json.username, _id: json._id }),
        {
          ttl: 30 * 24 * 60 * 60 * 1000, // 30 days,
        }
      );

      // update the user context
      setUser({ username: json.username });

      // update loading state
      setIsLoading(false);
    }
    return response;
  };

  return { signup, isLoading, error, setError };
};
