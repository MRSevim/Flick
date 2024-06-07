import { useState } from "react";
import pmsApi from "../../Utils/PmApiFunctions";
import { useConfirmationErrorContext } from "../../Contexts/UseConfirmationErrorContext";

export const useDeletePm = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setConfirmationError] = useConfirmationErrorContext();

  const deletePm = async (id) => {
    setIsLoading(true);
    setConfirmationError(null);

    const response = await pmsApi.delete(id);

    const json = await response.json();

    if (!response.ok) {
      setConfirmationError(json.message);
    }

    setIsLoading(false);

    return response;
  };

  return { deletePm, isLoading };
};
