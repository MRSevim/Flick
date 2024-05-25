import { useState } from "react";
import pmApi from "../../Utils/PmApiFunctions";

export const useSendPm = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const sendPm = async (id, subject, message) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const response = await pmApi.sendPm(id, subject, message);
    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
    }
    if (response.ok) {
      setSuccessMessage(json.message);
    }
    // update loading state
    setIsLoading(false);

    return { response, json };
  };

  return { sendPm, isLoading, error, setError, successMessage };
};
