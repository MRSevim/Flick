import React, { useState } from "react";
import Editor from "react-simple-wysiwyg";
import DOMPurify from "dompurify";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useCommentArticle } from "../../Hooks/CommentHooks/UseCommentArticle";
import { Link } from "react-router-dom";
import { useUserContext } from "../../Contexts/UserContext";
import { EditButton } from "./EditButton";
import { DeleteButton } from "./DeleteButton";
import { useEditComment } from "../../Hooks/CommentHooks/UseEditComment";
import { useDeleteComment } from "../../Hooks/CommentHooks/UseDeleteComment";
import links from "../../Utils/Links";
import { ImageComponent } from "../ImageComponent";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export const CommentSection = ({ article }) => {
  const [user] = useUserContext();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(article.comments);
  const [editedContent, setEditedContent] = useState("");
  const [editedCommentId, setEditedCommentId] = useState("");
  const { commentArticle, isLoading } = useCommentArticle();
  const { editComment: _editComment, isLoading: editLoading } =
    useEditComment();
  const { deleteComment: _deleteComment, isLoading: deleteLoading } =
    useDeleteComment();

  const submit = async (e) => {
    e.preventDefault();
    const { response, json } = await commentArticle(
      DOMPurify.sanitize(comment),
      article._id
    );
    if (response.ok) {
      setComments(json.comments);
    }
  };

  const editComment = async (id) => {
    const { response, json } = await _editComment(
      editedContent,
      article._id,
      id
    );
    if (response.ok) {
      const newComments = comments.map((comment) => {
        if (comment._id === id) {
          return json;
        } else {
          return comment;
        }
      });

      setComments(newComments);
      setEditedCommentId("");
      setEditedContent("");
    }
  };

  const deleteComment = async (id) => {
    const response = await _deleteComment(article._id, id);
    if (response && response.ok) {
      const newComments = comments.filter((comment) => comment._id !== id);

      setComments(newComments);
    }
  };

  return (
    <div className="my-3">
      {user && (
        <div>
          <h2 className="mb-2">Comments</h2>
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
        </div>
      )}
      {comments.length === 0 && user && (
        <h3 className="mt-3 ">
          There are no comments. Be the first to comment in this article!
        </h3>
      )}
      {comments.map((comment) => (
        <div className="border border-4 my-2 p-2" key={comment._id}>
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <ImageComponent
                src={comment.user.image}
                classes={"profile-img-mini mx-2"}
              />
              <Link
                className="unstyled-link"
                to={links.publicUser(comment.user._id)}
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

          {comment.user._id === user?._id && (
            <div className="text-end">
              <EditButton
                classes={"me-1"}
                onClick={() => {
                  if (editedCommentId === comment._id) {
                    setEditedContent("");
                    setEditedCommentId(null);
                  } else {
                    setEditedContent(comment.content);
                    setEditedCommentId(comment._id);
                  }
                }}
              />
              <DeleteButton
                disabled={deleteLoading}
                onClick={() => {
                  deleteComment(comment._id);
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
