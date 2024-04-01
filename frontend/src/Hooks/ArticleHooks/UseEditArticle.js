import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";

export const useEditArticle = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const editArticle = async (title, content, isDraft, id, tags) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await articleApi.update(title, content, isDraft, id, tags);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);
    return response;
  };

  return { editArticle, isLoading };
};
