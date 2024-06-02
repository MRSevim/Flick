import { useState } from "react";
import emailApi from "../../Utils/EmailApiFunctions";

export const useSendEmail = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const sendEmail = async (email, type) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const response = await emailApi.sendEmail(email, type);
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

  return { sendEmail, isLoading, error, successMessage };
};
