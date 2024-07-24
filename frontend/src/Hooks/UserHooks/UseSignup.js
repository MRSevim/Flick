import { useState } from "react";
import userApi from "../../Utils/UserApiFunctions";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const signup = async (username, email, password, token) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const response = await userApi.signup(username, email, password, token);
    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
    }
    if (response.ok) {
      setSuccessMessage(json.message);
    }
    // update loading state
    setIsLoading(false);
    return response;
  };

  return { signup, isLoading, error, setError, successMessage };
};
