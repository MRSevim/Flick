import { useState } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import userApi from "../../Utils/UserApiFunctions";
import ls from "localstorage-slim";

export const useUpdateUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();
  const [successMessage, setSuccessMessage] = useState(null);

  const update = async (username, email, password, newPassword, image) => {
    setSuccessMessage(null);
    setIsLoading(true);
    setError(null);

    const response = await userApi.update(
      username,
      email,
      password,
      newPassword,
      image
    );
    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
    }
    if (response.ok) {
      const { message, username, _id, isGoogleLogin, image } = json;
      const userObject = { username, _id, isGoogleLogin, image };

      // update the user in storage
      let userInLocalStorage = JSON.parse(localStorage.getItem("user"));
      if (userInLocalStorage) {
        const { ttl } = userInLocalStorage;
        const now = new Date().getTime();
        const milliseconds = ttl - now;
        const seconds = milliseconds / 1000;

        ls.set("user", JSON.stringify(userObject), {
          ttl: seconds,
        });
      }
      // update the user in storage
      let userInSessionStorage = JSON.parse(sessionStorage.getItem("user"));

      if (userInSessionStorage) {
        sessionStorage.setItem("user", JSON.stringify(userObject));
      }
      // update the user context
      setUser(userObject);

      // update state
      setSuccessMessage(message);
    }
    setIsLoading(false);
    return response;
  };

  return { update, isLoading, successMessage, error, setError };
};
