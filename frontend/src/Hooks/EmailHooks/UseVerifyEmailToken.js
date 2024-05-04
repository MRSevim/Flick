import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import emailApi from "../../Utils/EmailApiFunctions";

export const useVerifyEmailToken = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const verifyEmailToken = async (token) => {
    setIsLoading(true);
    setGlobalError(null);
    setSuccessMessage(null);

    const response = await emailApi.verifyEmailToken(token);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);

    return { response, json };
  };

  return { verifyEmailToken, isLoading, successMessage, setSuccessMessage };
};
