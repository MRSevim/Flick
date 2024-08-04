import { useState } from "react";
import { useConfirmationErrorContext } from "@/contexts/ConfirmationErrorContext";
import { deleteManyCall } from "@/utils/ApiCalls/ArticleApiFunctions";

export const UseDeleteManyArticles = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setConfirmationError] = useConfirmationErrorContext();

  const deleteManyArticles = async (ids, userId) => {
    setIsLoading(true);
    setConfirmationError(null);

    const error = await deleteManyCall(ids, userId);

    if (error) {
      setConfirmationError(error);
    }

    setIsLoading(false);

    return error;
  };

  return { deleteManyArticles, isLoading };
};
