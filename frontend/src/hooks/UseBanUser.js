import { useState } from "react";
import { useConfirmationErrorContext } from "@/contexts/ConfirmationErrorContext";
import { banUserCall } from "@/utils/ApiCalls/UserApiFunctions";

export const useBanUser = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setConfirmationError] = useConfirmationErrorContext();

  const _banUser = async (id, reason) => {
    setIsLoading(true);
    setConfirmationError(null);

    const { error } = await banUserCall(id, reason);

    if (error) {
      setConfirmationError(error);
    }

    setIsLoading(false);

    return error;
  };

  return { _banUser, isLoading };
};
