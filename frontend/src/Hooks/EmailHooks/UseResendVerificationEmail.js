import { useState } from "react";
import emailApi from "../../Utils/EmailApiFunctions";

export const useResendVerificationEmail = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const resendVerificationEmail = async (email) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const response = await emailApi.resendVerificationEmail(email);
    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
    }
    if (response.ok) {
      setSuccessMessage(json.message);
    }

    setIsLoading(false);

    return { response, json };
  };

  return { resendVerificationEmail, isLoading, error, successMessage };
};
