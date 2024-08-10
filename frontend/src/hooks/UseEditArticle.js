import { useState } from "react";
import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";
import { updateArticleCall } from "@/utils/ApiCalls/ArticleApiFunctions";

export const useEditArticle = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);

  const editArticle = async (
    title,
    content,
    isDraft,
    id,
    tags,
    image,
    previousIsDraft
  ) => {
    setIsLoading(true);
    setGlobalError(null);

    const error = await updateArticleCall(
      title,
      content,
      isDraft,
      id,
      tags,
      image,
      previousIsDraft
    );

    setIsLoading(false);

    if (error) {
      setGlobalError(error);
    }
    return error;
  };

  return { editArticle, isLoading };
};
