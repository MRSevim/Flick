import { useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { updateUserCall } from "@/utils/ApiCalls/UserApiFunctions";
import Cookies from "js-cookie";

export const useUpdateUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [, setUser] = useUserContext();

  const update = async (username, email, password, newPassword, image) => {
    setIsLoading(true);
    Cookies.remove("profileUpdateSuccessMessage");
    Cookies.remove("profileUpdatedEmail");

    const { error, successMessage, userObject } = await updateUserCall(
      username,
      email,
      password,
      newPassword,
      image
    );

    setIsLoading(false);
    if (error) {
      setError(error);
      return { error };
    }
    if (successMessage) {
      // update the user context
      setUser(userObject);

      // update cookies
      Cookies.set("profileUpdateSuccessMessage", successMessage);

      if (email) {
        Cookies.set("profileUpdatedEmail", email);
      }

      return { successMessage };
    }
  };

  return {
    update,
    isLoading,
    error,
    setError,
  };
};
