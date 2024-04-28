import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";
import { useConfirmationContext } from "../../Contexts/UseConfirmationContext";

export const useDeleteArticle = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);
  const { confirmation, setConfirmation } = useConfirmationContext();

  const deleteArticle = async (id, title) => {
    confirmation.ref.current.show();

    setConfirmation({
      ...confirmation,
      type: "delete",
      info: {
        title,
      },
    });
    setGlobalError(null);

    const isConfirmed = await confirmation.confirmed;

    if (isConfirmed) {
      setIsLoading(true);

      const response = await articleApi.delete(id);
      const json = await response.json();

      if (!response.ok) {
        setGlobalError(json.message);
      }
      setIsLoading(false);

      return response;
    } else {
      return;
    }
  };

  return { deleteArticle, isLoading };
};
