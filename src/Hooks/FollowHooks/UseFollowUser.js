import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import followApi from "../../Utils/FollowApiFunctions";

export const useFollowUser = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const followUser = async (id) => {
    setIsLoading(true);
    setGlobalError(null);

    const response = await followApi.follow(id);
    const json = await response.json();

    if (!response.ok) {
      setGlobalError(json.message);
    }

    setIsLoading(false);

    return { response, json };
  };

  return { followUser, isLoading };
};
