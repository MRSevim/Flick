import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";

export const useGetArticle = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const getArticle = async (id, isDraft) => {
    setIsLoading(true);
    setGlobalError(null);

    const get = (id, isDraft) => {
      if (!isDraft) {
        return articleApi.getArticle(id);
      } else {
        return articleApi.getDraft(id);
      }
    };

    const response = await get(id, isDraft);

    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);

    return { response, json };
  };

  return { getArticle, isLoading };
};
