import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import pmApi from "../../Utils/PmApiFunctions";

export const useGetPms = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const getPms = async (page, type) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await pmApi.getPms(page, type);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }
    setIsLoading(false);
    return { response, json };
  };

  return { getPms, isLoading };
};
