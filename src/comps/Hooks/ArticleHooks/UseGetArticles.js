import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";

export const useGetArticles = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const getArticles = async (id) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await articleApi.getArticles(id);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
      setIsLoading(false);
    }
    if (response.ok) {
      setIsLoading(false);
    }

    setIsLoading(false);

    return json;
  };

  return { getArticles, isLoading };
};
