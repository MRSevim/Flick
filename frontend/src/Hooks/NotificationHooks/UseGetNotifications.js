import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import notificationApi from "../../Utils/NotificationApiFunctions";

export const useGetNotifications = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const getNotifications = async () => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await notificationApi.getNotifications();
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }
    setIsLoading(false);
    return { response, json };
  };

  return { getNotifications, isLoading };
};
