import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import pmsApi from "../../Utils/PmApiFunctions";
import { useConfirmationContext } from "../../Contexts/UseConfirmationContext";
import { confirmationWrapper } from "../../Utils/HelperFuncs";

export const useDeleteMany = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);
  const { confirmation, setConfirmation } = useConfirmationContext();

  const deleteMany = async (ids) => {
    return confirmationWrapper(
      confirmation,
      {
        ...confirmation,
        type: "deleteManyMessages",
        info: {
          size: ids.length,
        },
      },
      setConfirmation,
      setGlobalError,
      setIsLoading,
      async () => {
        return await pmsApi.deleteMany(ids);
      }
    );
  };

  return { deleteMany, isLoading };
};
