import { useState } from "react";
import { sendPmCall } from "@/utils/ApiCalls/PmApiFunctions";

export const useSendPm = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const sendPm = async (id, subject, message) => {
    setIsLoading(true);
    setError(null);

    const { error } = await sendPmCall(id, subject, message);

    setIsLoading(false);

    if (error) {
      setError(json.message);
      return;
    }

    return;
  };

  return { sendPm, isLoading, error, setError };
};
