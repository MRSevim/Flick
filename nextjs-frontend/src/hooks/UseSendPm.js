import { useState } from "react";
import { sendPmCall } from "@/utils/ApiCalls/PmApiFunctions";

export const useSendPm = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const sendPm = async (id, subject, message, userId) => {
    setIsLoading(true);

    setError(null);

    const error = await sendPmCall(id, subject, message, userId);

    setIsLoading(false);

    if (error) {
      setError(error);
      return error;
    }

    return;
  };

  return { sendPm, isLoading, error, setError };
};
