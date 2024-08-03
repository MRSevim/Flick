import { useConfirmationContext } from "@/contexts/ConfirmationContext";
import { useDeleteArticle } from "@/hooks/UseDeleteArticle";
import { confirmationWrapper } from "@/utils/HelperFuncs";

export const DeleteButton = ({ article, user, deleteManyLoading, classes }) => {
  const { confirmation, setConfirmation } = useConfirmationContext();
  const { deleteArticle, isLoading } = useDeleteArticle();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit}>
      <button
        disabled={deleteManyLoading || isLoading}
        className={"btn btn-danger " + classes}
      >
        <i className="bi bi-trash-fill"></i>
      </button>
    </form>
  );
};
