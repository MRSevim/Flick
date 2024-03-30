import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import notificationApi from "../../Utils/NotificationApiFunctions";

export const useClearNotifications = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const clearNotifications = async () => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await notificationApi.clearNotifications();
    const json = response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }
    setIsLoading(false);
    return response;
  };

  return { clearNotifications, isLoading };
};
