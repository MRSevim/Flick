import { useState } from "react";
import { useConfirmationErrorContext } from "@/contexts/ConfirmationErrorContext";
import { deleteCall } from "@/utils/ApiCalls/PmApiFunctions";

export const useDeletePm = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setConfirmationError] = useConfirmationErrorContext();

  const deletePm = async (id, type, userId) => {
    setIsLoading(true);
    setConfirmationError(null);

    const error = await deleteCall(id, type, userId);

    if (error) {
      setConfirmationError(error);
    }

    setIsLoading(false);

    return error;
  };

  return { deletePm, isLoading };
};
