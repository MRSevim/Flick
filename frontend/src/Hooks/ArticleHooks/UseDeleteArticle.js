import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";
import { useConfirmationContext } from "../../Contexts/UseConfirmationContext";
import { confirmationWrapper } from "../../Utils/HelperFuncs";

export const useDeleteArticle = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);
  const { confirmation, setConfirmation } = useConfirmationContext();

  const deleteArticle = async (id, title) => {
    return confirmationWrapper(
      confirmation,
      {
        ...confirmation,
        type: "deleteArticle",
        info: {
          title,
        },
      },
      setConfirmation,
      setGlobalError,
      setIsLoading,
      async () => {
        return await articleApi.delete(id);
      }
    );
  };

  return { deleteArticle, isLoading };
};
