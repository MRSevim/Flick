import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";

export const useCommentArticle = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const commentArticle = async (content, id) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await articleApi.comment(content, id);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);
    return { response, json };
  };

  return { commentArticle, isLoading };
};
