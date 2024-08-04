import { useConfirmationContext } from "@/contexts/ConfirmationContext";
import { useDeleteArticle } from "@/hooks/UseDeleteArticle";
import { confirmationWrapper } from "@/utils/HelperFuncs";
import { GenericDeleteButton } from "./GenericDeleteButton";

export const DeleteButton = ({ article, user, deleteManyLoading, classes }) => {
  const { confirmation, setConfirmation } = useConfirmationContext();
  const { deleteArticle, isLoading } = useDeleteArticle();

  const handleSubmit = async () => {
    const { _id, title, user: articleUser } = article;
    const articleUserId = articleUser._id || articleUser;
    const ownArticle = articleUserId === user._id;

    confirmationWrapper(
      confirmation,
      (prev) => {
        return {
          ...confirmation,
          type: "deleteArticle",
          info: {
            ...prev.info,
            owned: ownArticle,
            title,
          },
        };
      },
      setConfirmation,
      async (reason) => {
        return await deleteArticle(_id, reason, user._id);
      },
      () => {
        setConfirmation((prev) => ({
          ...prev,
          info: { ...prev.info, reason: "" },
        }));
      }
    );
  };

  return (
    <GenericDeleteButton
      onClick={handleSubmit}
      disabled={deleteManyLoading || isLoading}
      classes={classes}
    />
  );
};
