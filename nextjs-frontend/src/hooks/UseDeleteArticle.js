import { useState } from "react";
import { useConfirmationErrorContext } from "@/contexts/ConfirmationErrorContext";
import { deleteArticleCall } from "@/utils/ApiCalls/ArticleApiFunctions";

export const useDeleteArticle = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setConfirmationError] = useConfirmationErrorContext();

  const deleteArticle = async (id, reason, userId) => {
    setIsLoading(true);
    setConfirmationError(null);

    const { error } = await deleteArticleCall(id, reason, userId);

    if (error) {
      setConfirmationError(error);
    }

    setIsLoading(false);

    return error;
  };

  return { deleteArticle, isLoading };
};
