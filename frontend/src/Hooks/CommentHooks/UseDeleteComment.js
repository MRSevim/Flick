import { useState } from "react";
import { useGlobalErrorContext } from "../../Contexts/GlobalErrorContext";
import commentApi from "../../Utils/CommentApiFunctions";
import { useConfirmationContext } from "../../Contexts/UseConfirmationContext";
import { confirmationWrapper } from "../../Utils/HelperFuncs";

export const useDeleteComment = () => {
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);
  const { confirmation, setConfirmation } = useConfirmationContext();

  const deleteComment = async (articleId, commentId) => {
    return confirmationWrapper(
      confirmation,
      {
        ...confirmation,
        type: "deleteComment",
        info: null,
      },
      setConfirmation,
      setGlobalError,
      setIsLoading,
      async () => {
        return await commentApi.delete(articleId, commentId);
      }
    );
  };

  return { deleteComment, isLoading };
};
