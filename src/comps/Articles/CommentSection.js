import React, { useState } from "react";
import Editor from "react-simple-wysiwyg";
import DOMPurify from "dompurify";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useCommentArticle } from "../Hooks/ArticleHooks/UseCommentArticle";
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export const CommentSection = ({ article }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(article.comments);
  const { commentArticle, isLoading } = useCommentArticle();

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

  return (
    <>
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
          className="btn btn-dark mt-3 w-100 py-2"
          type="submit"
          value="Comment"
        />
      </form>
      {comments.length === 0 && (
        <h3 className="mt-3 ">There are no comments to display</h3>
      )}
      {comments.map((comment, i) => (
        <div
          className="border border-4 position-relative my-2 p-2"
          key={comment._id}
        >
          <b>{comment.user}</b>
          <span className="position-absolute top-0 end-0 m-1 me-3">
            {timeAgo.format(new Date(comment.created))}
          </span>
          <div
            dangerouslySetInnerHTML={{
              __html: comment.content,
            }}
          ></div>
        </div>
      ))}
    </>
  );
};
