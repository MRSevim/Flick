import { useState } from "react";
import pmsApi from "../../Utils/PmApiFunctions";
import { useConfirmationErrorContext } from "../../Contexts/UseConfirmationErrorContext";

export const useDeleteMany = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setConfirmationError] = useConfirmationErrorContext();

  const deleteMany = async (ids) => {
    setIsLoading(true);
    setConfirmationError(null);

    const response = await pmsApi.deleteMany(ids);

    const json = await response.json();

    if (!response.ok) {
      setConfirmationError(json.message);
    }

    setIsLoading(false);

    return response;
  };

  return { deleteMany, isLoading };
};
