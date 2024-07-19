import { useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { updateUserCall } from "@/utils/ApiCalls/UserApiFunctions";

export const useUpdateUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();
  const [successMessage, setSuccessMessage] = useState(null);

  const update = async (username, email, password, newPassword, image) => {
    setIsLoading(true);

    const { error, successMessage, userObject } = await updateUserCall(
      username,
      email,
      password,
      newPassword,
      image
    );

    if (error) {
      setError(error);
      setIsLoading(false);
      return { error };
    }
    if (successMessage) {
      // update the user context
      setUser(userObject);

      // update state
      setSuccessMessage(successMessage);
      setIsLoading(false);
      return { successMessage };
    }
  };

  return {
    update,
    isLoading,
    successMessage,
    error,
    setError,
    setSuccessMessage,
  };
};
