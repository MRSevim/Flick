import { useState } from "react";
import userApi from "../../Utils/UserApiFunctions";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";

export const useGetUser = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setGlobalError] = useGlobalErrorContext();

  const getUser = async () => {
    setGlobalError(null);
    setIsLoading(true);
    const response = await userApi.getProfile();
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }
    // update loading state
    setIsLoading(false);

    return { response, json };
  };

  return { getUser, isLoading };
};
