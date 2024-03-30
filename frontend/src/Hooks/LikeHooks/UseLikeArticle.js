import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import likeApi from "../../Utils/LikeApiFunctions";

export const useLikeArticle = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const likeArticle = async (id) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await likeApi.like(id);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);

    return { response, json };
  };

  return { likeArticle, isLoading };
};
