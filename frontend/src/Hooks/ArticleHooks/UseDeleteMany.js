import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import articleApi from "../../Utils/ArticleApiFunctions";

export const useDeleteMany = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const deleteMany = async (ids) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await articleApi.deleteMany(ids);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);
    return response;
  };

  return { deleteMany, isLoading };
};
