import { useState } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import userApi from "../../Utils/UserApiFunctions";

export const useDeleteUser = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();

  const deleteUser = async (password) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    setIsLoading(true);
    setGlobalError(null);

    const response = await userApi.delete(password);
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setGlobalError(json.message);
    }
    if (response.ok) {
      setSuccessMessage("User is deleted. Logging out in 5 seconds...");

      // remove from local storage
      localStorage.removeItem("user");

      await delay(5000);

      // update the user context
      setUser(undefined);

      // update loading state
      setIsLoading(false);
    }
    return response;
  };

  return { deleteUser, isLoading, successMessage };
};
