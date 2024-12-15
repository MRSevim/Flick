import { useConfirmationContext } from "@/contexts/ConfirmationContext";
import { useDeleteArticle } from "@/hooks/UseDeleteArticle";
import { confirmationWrapper, getFirstPartOfPath } from "@/utils/HelperFuncs";
import { GenericDeleteButton } from "./GenericDeleteButton";
import { useRouter, usePathname } from "next/navigation";
import links from "@/utils/Links";
import { useUserContext } from "@/contexts/UserContext";

export const DeleteButton = ({ article, deleteManyLoading, classes }) => {
  const [user] = useUserContext();
  const { confirmation, setConfirmation } = useConfirmationContext();
  const { deleteArticle, isLoading } = useDeleteArticle();
  const router = useRouter();
  const pathname = usePathname();

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
        const isDraft = article.isDraft === "true";
        const partialPathName = getFirstPartOfPath(pathname);
        if (ownArticle) {
          if (partialPathName === "article") {
            router.push(links.allArticles(user._id));
          }
          if (partialPathName === "edit") {
            if (isDraft) {
              router.push(links.allDrafts(user._id));
            } else {
              router.push(links.allArticles(user._id));
            }
          }
        }
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
