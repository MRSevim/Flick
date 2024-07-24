import { useState } from "react";
import articleApi from "../../Utils/ArticleApiFunctions";
import { useConfirmationErrorContext } from "../../Contexts/UseConfirmationErrorContext";

export const useDeleteMany = () => {
  const [, setConfirmationError] = useConfirmationErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const deleteMany = async (ids) => {
    setIsLoading(true);
    setConfirmationError(null);

    const response = await articleApi.deleteMany(ids);

    const json = await response.json();

    if (!response.ok) {
      setConfirmationError(json.message);
    }

    setIsLoading(false);

    return response;
  };

  return { deleteMany, isLoading };
};
