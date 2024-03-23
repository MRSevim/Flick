import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import followApi from "../../Utils/FollowApiFunctions";

export const useGetFollows = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const getFollows = async (id, type) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await followApi.getFollows(id, type);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);

    return { response, json };
  };

  return { getFollows, isLoading };
};
