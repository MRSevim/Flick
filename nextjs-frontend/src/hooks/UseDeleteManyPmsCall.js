import { useState } from "react";
import { useConfirmationErrorContext } from "@/contexts/ConfirmationErrorContext";
import { deleteManyCall } from "@/utils/ApiCalls/PmApiFunctions";

export const useDeleteMany = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setConfirmationError] = useConfirmationErrorContext();

  const deleteMany = async (ids, type, userId) => {
    setIsLoading(true);
    setConfirmationError(null);

    const error = await deleteManyCall(ids, type, userId);

    if (error) {
      setConfirmationError(error);
    }

    setIsLoading(false);

    return error;
  };

  return { deleteMany, isLoading };
};
