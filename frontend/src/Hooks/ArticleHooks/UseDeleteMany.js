import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";
import { useConfirmationContext } from "../../Contexts/UseConfirmationContext";

export const useDeleteMany = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);
  const { confirmation, setConfirmation } = useConfirmationContext();

  const deleteMany = async (ids) => {
    confirmation.ref.current.show();

    setConfirmation({
      ...confirmation,
      type: "deleteMany",
      info: {
        size: ids.length,
      },
    });
    setGlobalError(null);
    const isConfirmed = await confirmation.confirmed;
    if (isConfirmed) {
      setIsLoading(true);

      const response = await articleApi.deleteMany(ids);
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

  return { deleteMany, isLoading };
};
