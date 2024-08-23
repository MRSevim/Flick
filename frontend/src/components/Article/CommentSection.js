import { useState } from "react";
import Editor from "react-simple-wysiwyg";
import DOMPurify from "dompurify";
import { timeAgo, confirmationWrapper } from "@/utils/HelperFuncs";
import Link from "next/link";
import { useUserContext } from "@/contexts/UserContext";
import links from "@/utils/Links";
import { Image } from "../Image";
import { useConfirmationContext } from "@/contexts/ConfirmationContext";
import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";
import {
  commentCall,
  editCommentCall,
} from "@/utils/ApiCalls/CommentApiFunctions";
import { GenericDeleteButton } from "../GenericDeleteButton";
import { useDeleteComment } from "@/hooks/UseDeleteComment";

export const CommentSection = ({ article }) => {
  const [user] = useUserContext();
  const [comment, setComment] = useState("");
  const comments = article.comments;
  const [editedContent, setEditedContent] = useState("");
  const [editedCommentId, setEditedCommentId] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const [editLoading, setEditLoading] = useState(null);
  const [, setGlobalError] = useGlobalErrorContext();
  const { confirmation, setConfirmation } = useConfirmationContext();
  const { deleteComment: _deleteComment, isLoading: deleteLoading } =
    useDeleteComment();

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const error = await commentCall(
      DOMPurify.sanitize(comment),
      article._id,
      article.user._id
    );
    setIsLoading(false);
    if (error) {
      setGlobalError(error);
    }
  };

  const editComment = async (id) => {
    setEditLoading(true);
    const error = await editCommentCall(editedContent, article._id, id);
    setEditLoading(false);
    if (error) {
      setGlobalError(error);
    } else {
      setEditedCommentId("");
      setEditedContent("");
    }
  };

  const deleteComment = async (id, ownComment, commentOwnerId) => {
    confirmationWrapper(
      confirmation,
      (prev) => {
        return {
          ...prev,
          type: "deleteComment",
          info: { ...prev.info, owned: ownComment },
        };
      },
      setConfirmation,
      async (reason) => {
        return await _deleteComment(
          article._id,
          id,
          reason,
          article.user._id,
          commentOwnerId
        );
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
    <div className="my-3">
      <h2 className="mb-2">Comments</h2>
      {user && (
        <>
          <form onSubmit={submit}>
            <Editor
              containerProps={{ style: { height: "175px" } }}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <input
              disabled={isLoading}
              className="btn btn-info mt-3 w-100 py-2"
              type="submit"
              value="Comment"
            />
          </form>
        </>
      )}
      {comments.length === 0 && user && (
        <h3 className="mt-3 ">
          There are no comments. Consider writing one...
        </h3>
      )}
      {comments.map((comment) => (
        <div className="border border-4 my-2 p-2" key={comment._id}>
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <div className="mx-2 profile-img-mini-container">
                <Image
                  src={comment.user.image}
                  classes={"profile-img-mini mw-100 mh-100"}
                />
              </div>
              <Link
                className="unstyled-link"
                href={links.publicUser(comment.user._id)}
              >
                <b>{comment.user.username}</b>
              </Link>
            </div>
            <span className="">
              {timeAgo.format(new Date(comment.created))}
            </span>
          </div>

          {editedCommentId !== comment._id && (
            <div
              className="m-2"
              dangerouslySetInnerHTML={{
                __html: comment.content,
              }}
            ></div>
          )}
          {editedCommentId === comment._id && (
            <form
              className="my-2"
              onSubmit={(e) => {
                e.preventDefault();
                editComment(comment._id);
              }}
            >
              <Editor
                containerProps={{
                  style: { height: "175px" },
                }}
                value={editedContent}
                onChange={(e) => {
                  setEditedContent(e.target.value);
                }}
              />
              <input
                disabled={editLoading}
                className="btn btn-info mt-3 w-100 py-2"
                type="submit"
                value="Save"
              />
            </form>
          )}

          <div className="d-flex justify-content-end">
            {comment.user._id === user?._id && (
              <button
                className="btn btn-warning me-1"
                onClick={() => {
                  if (editedCommentId === comment._id) {
                    setEditedContent("");
                    setEditedCommentId(null);
                  } else {
                    setEditedContent(comment.content);
                    setEditedCommentId(comment._id);
                  }
                }}
              >
                <i className="bi bi-pencil-fill"></i>
              </button>
            )}
            {(comment.user._id === user?._id ||
              user?.role === "mod" ||
              user?.role === "admin") && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  deleteComment(
                    comment._id,
                    comment.user._id === user?._id,
                    comment.user._id
                  );
                }}
              >
                <GenericDeleteButton disabled={deleteLoading} />
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
