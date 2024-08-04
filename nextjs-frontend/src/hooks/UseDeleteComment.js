import { useState } from "react";
import { useConfirmationErrorContext } from "@/contexts/ConfirmationErrorContext";
import { deleteCommentCall } from "@/utils/ApiCalls/CommentApiFunctions";

export const useDeleteComment = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [, setConfirmationError] = useConfirmationErrorContext();

  const deleteComment = async (
    articleId,
    commentId,
    reason,
    articleOwnerId,
    commentOwnerId
  ) => {
    setIsLoading(true);
    setConfirmationError(null);

    const error = await deleteCommentCall(
      articleId,
      commentId,
      reason,
      articleOwnerId,
      commentOwnerId
    );

    if (error) {
      setConfirmationError(error);
    }

    setIsLoading(false);

    return error;
  };

  return { deleteComment, isLoading };
};
