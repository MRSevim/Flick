import { useState } from "react";
import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";
import { searchAllCall } from "@/utils/ApiCalls/SearchApiFunctions";

export const useSearchAll = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const searchAll = async (query) => {
    setIsLoading(true);
    setGlobalError(null);

    const { json, error } = await searchAllCall(query);

    setIsLoading(false);
    if (error) {
      setGlobalError(json.message);
      return;
    }
    return json;
  };

  return { searchAll, isLoading };
};
