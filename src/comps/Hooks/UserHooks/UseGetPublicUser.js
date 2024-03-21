import { useState } from "react";
import userApi from "../../Utils/UserApiFunctions";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";

export const useGetPublicUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [, setGlobalError] = useGlobalErrorContext();

  const getPublicUser = async (param) => {
    setGlobalError(null);

    const response = await userApi.getPublicUser(param);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    // update loading state
    setIsLoading(false);

    return { response, json };
  };

  return { getPublicUser, isLoading };
};
