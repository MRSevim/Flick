import { useState } from "react";
import commentApi from "../../Utils/CommentApiFunctions";
import { useConfirmationErrorContext } from "../../Contexts/UseConfirmationErrorContext";

export const useDeleteComment = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setConfirmationError] = useConfirmationErrorContext();

  const deleteComment = async (articleId, commentId, reason) => {
    setIsLoading(true);
    setConfirmationError(null);

    const response = await commentApi.delete(articleId, commentId, reason);

    const json = await response.json();

    if (!response.ok) {
      setConfirmationError(json.message);
    }

    setIsLoading(false);

    return response;
  };

  return { deleteComment, isLoading };
};
