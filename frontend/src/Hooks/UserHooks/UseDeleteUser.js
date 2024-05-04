import { useState } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import userApi from "../../Utils/UserApiFunctions";
import { delay } from "../../Utils/HelperFuncs";

export const useDeleteUser = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();

  const deleteUser = async (password) => {
    setIsLoading(true);
    setError(null);

    const response = await userApi.delete(password);
    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
    }
    if (response.ok) {
      setSuccessMessage("User is deleted. Logging out in 5 seconds...");

      // remove from local storage
      localStorage.removeItem("user");

      await delay(5000);

      // update the user context
      setUser(undefined);
    }

    // update loading state
    setIsLoading(false);
    return response;
  };

  return { deleteUser, isLoading, error, successMessage };
};
