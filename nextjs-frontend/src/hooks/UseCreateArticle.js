import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";
import { createArticleCall } from "@/utils/ApiCalls/ArticleApiFunctions";
import { useState } from "react";

export const useCreateArticle = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setGlobalError] = useGlobalErrorContext();

  const createArticle = async (
    title,
    content,
    isDraft,
    tags,
    image,
    userId
  ) => {
    setIsLoading(true);
    setGlobalError(null);

    const { error } = await createArticleCall(
      title,
      content,
      isDraft,
      tags,
      image,
      userId
    );

    if (error) {
      setGlobalError(error);
    }

    setIsLoading(false);

    return { error };
  };

  return { createArticle, isLoading };
};
