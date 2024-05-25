import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";
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
        type: "deleteManyArticles",
        info: {
          size: ids.length,
        },
      },
      setConfirmation,
      setGlobalError,
      setIsLoading,
      async () => {
        return await articleApi.deleteMany(ids);
      }
    );
  };

  return { deleteMany, isLoading };
};
