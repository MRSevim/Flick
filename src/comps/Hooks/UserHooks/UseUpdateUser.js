import { useState } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import userApi from "../../Utils/UserApiFunctions";
import ls from "localstorage-slim";

export const useUpdateUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();

  const update = async (username, email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await userApi.update(username, email, password);
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
    }
    if (response.ok) {
      // update the user in local storage
      let user = JSON.parse(localStorage.getItem("username"));

      const { ttl } = user;
      const now = new Date().getTime();
      const milliseconds = ttl - now;
      const seconds = milliseconds / 1000;
      console.log(ttl, now, seconds);

      ls.set("username", JSON.stringify({ username }), { ttl: seconds });

      // update the user context
      setUser({ username: json.username });

      // update loading state
      setIsLoading(false);
    }
    return response;
  };

  return { update, isLoading, error, setError };
};
