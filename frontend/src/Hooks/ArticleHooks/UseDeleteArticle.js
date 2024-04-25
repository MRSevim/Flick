import { useEffect, useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";
import { useConfirmationContext } from "../../Contexts/UseConfirmationContext";

export const useDeleteArticle = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);
  const [confirmation, setConfirmation] = useConfirmationContext();

  useEffect(() => {
    console.log(confirmation.confirmed);
    if (confirmation.confirmed) {
      deleteArticle(confirmation.info.id, confirmation.info.target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmation]);

  const deleteArticle = async (id, title) => {
    if (confirmation.confirmed === null) {
      confirmation.ref.current.show();
    }
    setConfirmation({
      ...confirmation,
      info: {
        text: "delete article titled:",
        id,
        title,
      },
    });
    setGlobalError(null);
    if (confirmation.confirmed) {
      setIsLoading(true);
      setConfirmation({ ...confirmation, isLoading });
      const response = await articleApi.delete(id);
      const json = await response.json();

      if (!response.ok) {
        setGlobalError(json.message);
      }
      setConfirmation({ ...confirmation, confirmed: false });
      setIsLoading(false);
      return response;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  return { deleteArticle, isLoading };
};
