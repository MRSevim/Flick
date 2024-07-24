import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import likeApi from "../../Utils/LikeApiFunctions";

export const useGetMostLiked = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const getMostLiked = async (time) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await likeApi.getMostLiked(time);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);

    return { response, json };
  };

  return { getMostLiked, isLoading };
};
