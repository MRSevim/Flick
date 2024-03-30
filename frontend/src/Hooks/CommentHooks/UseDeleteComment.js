import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import commentApi from "../../Utils/CommentApiFunctions";

export const useDeleteComment = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const deleteComment = async (articleId, commentId) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await commentApi.delete(articleId, commentId);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);

    return response;
  };

  return { deleteComment, isLoading };
};
