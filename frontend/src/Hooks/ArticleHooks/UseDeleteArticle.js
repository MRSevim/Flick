import { useState } from "react";
import articleApi from "../../Utils/ArticleApiFunctions";
import { useConfirmationErrorContext } from "../../Contexts/UseConfirmationErrorContext";

export const useDeleteArticle = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setConfirmationError] = useConfirmationErrorContext();

  const deleteArticle = async (id, reason) => {
    setIsLoading(true);
    setConfirmationError(null);

    const response = await articleApi.delete(id, reason);

    const json = await response.json();

    if (!response.ok) {
      setConfirmationError(json.message);
    }

    setIsLoading(false);

    return response;
  };

  return { deleteArticle, isLoading };
};
