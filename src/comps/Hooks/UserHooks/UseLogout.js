import { useState } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import userApi from "../../Utils/UserApiFunctions";

export const useLogout = () => {
  const [error, setError] = useState(null);

  const [, setUser] = useUserContext();

  const logout = async () => {
    setError(null);

    const response = await userApi.logout();
    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.removeItem("username");

      // update the user context
      setUser(undefined);
    }
  };

  return { logout, error, setError };
};
