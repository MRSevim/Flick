import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import commentApi from "../../Utils/CommentApiFunctions";

export const useEditComment = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const editComment = async (content, articleId, commentId) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await commentApi.edit(content, articleId, commentId);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);
    return { response, json };
  };

  return { editComment, isLoading };
};
