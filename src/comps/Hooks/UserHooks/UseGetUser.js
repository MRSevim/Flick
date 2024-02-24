import { useState } from "react";
import userApi from "../../Utils/UserApiFunctions";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";

export const useGetUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [, setGlobalError] = useGlobalErrorContext();

  const _getUser = async () => {
    setGlobalError(null);

    const response = await userApi.getProfile();
    const json = await response.json();

    if (response.ok) {
      setGlobalError(null);

      // update loading state
      setIsLoading(false);
    } else {
      setGlobalError(json.message);

      // update loading state
      setIsLoading(false);
    }

    return json;
  };

  return { _getUser, isLoading };
};
