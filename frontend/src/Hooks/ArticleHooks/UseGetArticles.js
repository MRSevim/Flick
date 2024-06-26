import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";

export const useGetArticles = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const getArticles = async (
    id,
    page,
    isDraft,
    advancedSearch,
    title,
    tags
  ) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await articleApi.getArticles(
      id,
      page,
      isDraft,
      advancedSearch,
      title,
      tags
    );
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);

    return { response, json };
  };

  return { getArticles, isLoading };
};
