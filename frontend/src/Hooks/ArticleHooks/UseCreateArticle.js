import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";

export const useCreateArticle = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const createArticle = async (title, content, isDraft, tags) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await articleApi.create(title, content, isDraft, tags);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);
    return response;
  };

  return { createArticle, isLoading };
};
