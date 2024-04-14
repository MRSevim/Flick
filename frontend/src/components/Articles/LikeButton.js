import React from "react";
import classNames from "classnames";
import { useUserContext } from "../../Contexts/UserContext";

export const LikeButton = ({ article, onClick, likeLoading, classes }) => {
  const [user] = useUserContext();
  return (
    <button
      onClick={onClick}
      disabled={likeLoading}
      className={"btn btn-secondary rounded-3 " + classes}
    >
      <i
        className={classNames({
          bi: true,
          "bi-hand-thumbs-up": article.likes.every((like) => {
            return like.user !== user?._id;
          }),
          "bi-hand-thumbs-up-fill": article.likes.some((like) => {
            return like.user === user?._id;
          }),
        })}
      ></i>{" "}
      <span>{article.likes.length}</span>
    </button>
  );
};
