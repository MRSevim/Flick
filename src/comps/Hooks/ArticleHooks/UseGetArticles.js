import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";

export const useGetArticles = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const getArticles = async (id, page, isDraft) => {
    setIsLoading(true);
    setGlobalError(null);

    const get = (id, page) => {
      if (!isDraft) {
        return articleApi.getArticles(id, page);
      } else return articleApi.getDrafts(page);
    };

    const response = await get(id, page);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);

    return { response, json };
  };

  return { getArticles, isLoading, setIsLoading };
};
