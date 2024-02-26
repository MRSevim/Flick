import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";

export const useCreateArticle = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const createArticle = async (title, content, isDraft) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await articleApi.create(title, content, isDraft);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);
    return response;
  };

  return { createArticle, isLoading };
};
