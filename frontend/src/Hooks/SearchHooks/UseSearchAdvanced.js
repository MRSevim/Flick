import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import searchApi from "../../Utils/SearchApiFunctions";

export const useSearchAdvanced = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const searchAdvanced = async (username, title, tags) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await searchApi.searchAdvanced(username, title, tags);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }
    setIsLoading(false);
    return { response, json };
  };

  return { searchAdvanced, isLoading };
};
