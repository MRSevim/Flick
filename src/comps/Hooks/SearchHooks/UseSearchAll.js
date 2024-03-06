import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import searchApi from "../../Utils/SearchApiFunctions";

export const useSearchAll = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const searchAll = async (query) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await searchApi.searchAll(query);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }
    setIsLoading(false);
    return json;
  };

  return { searchAll, isLoading };
};
