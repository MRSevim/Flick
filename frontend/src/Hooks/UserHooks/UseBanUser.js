import { useState } from "react";
import userApi from "../../Utils/UserApiFunctions";
import { useConfirmationErrorContext } from "../../Contexts/UseConfirmationErrorContext";

export const useBanUser = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setConfirmationError] = useConfirmationErrorContext();

  const banUser = async (id, reason) => {
    setIsLoading(true);
    setConfirmationError(null);

    const response = await userApi.ban(id, reason);

    const json = await response.json();

    if (!response.ok) {
      setConfirmationError(json.message);
    }

    setIsLoading(false);

    return response;
  };

  return { banUser, isLoading };
};
