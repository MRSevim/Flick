import { useState } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import userApi from "../../Utils/UserApiFunctions";
import ls from "localstorage-slim";

export const useUpdateUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();
  const [successMessage, setSuccessMessage] = useState(null);

  const update = async (username, email, password) => {
    setSuccessMessage(null);
    setIsLoading(true);
    setError(null);

    const response = await userApi.update(username, email, password);
    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
    }
    if (response.ok) {
      // update the user in local storage
      let user = JSON.parse(localStorage.getItem("user"));

      const { ttl } = user;
      const now = new Date().getTime();
      const milliseconds = ttl - now;
      const seconds = milliseconds / 1000;

      ls.set("user", JSON.stringify({ username, _id: json._id }), {
        ttl: seconds,
      });

      // update the user context
      setUser({ username: json.username });

      // update state
      setSuccessMessage("Profile updated");
    }
    setIsLoading(false);
    return response;
  };

  return { update, isLoading, successMessage, error, setError };
};
