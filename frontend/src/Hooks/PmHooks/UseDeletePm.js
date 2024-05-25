import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import pmsApi from "../../Utils/PmApiFunctions";
import { useConfirmationContext } from "../../Contexts/UseConfirmationContext";
import { confirmationWrapper } from "../../Utils/HelperFuncs";

export const useDeletePm = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);
  const { confirmation, setConfirmation } = useConfirmationContext();

  const deletePm = async (id, subject) => {
    return confirmationWrapper(
      confirmation,
      {
        ...confirmation,
        type: "deleteMessage",
        info: {
          subject,
        },
      },
      setConfirmation,
      setGlobalError,
      setIsLoading,
      async () => {
        return await pmsApi.delete(id);
      }
    );
  };

  return { deletePm, isLoading };
};
