import React, { useState } from "react";
import classNames from "classnames";
import { useUserContext } from "../../Contexts/UserContext";
import { useLikeArticle } from "../../Hooks/LikeHooks/UseLikeArticle";

export const LikeButton = ({ article, classes }) => {
  const [user] = useUserContext();
  const { likeArticle: likeArticleCall, isLoading } = useLikeArticle();
  const [liked, setLiked] = useState(
    article.likes.some((like) => {
      return like.user === user?._id;
    })
  );
  const [likeCount, setLikeCount] = useState(+article.likes.length);

  const likeArticle = async () => {
    const response = await likeArticleCall(article._id);
    if (response.ok) {
      if (!liked) {
        setLikeCount((prev) => prev + 1);
      } else if (liked) {
        setLikeCount((prev) => prev - 1);
      }
      setLiked((prev) => !prev);
    }
  };
  return (
    <button
      onClick={likeArticle}
      disabled={isLoading}
      className={"btn btn-secondary rounded-3 " + classes}
    >
      <i
        className={classNames({
          bi: true,
          "bi-hand-thumbs-up": !liked,
          "bi-hand-thumbs-up-fill": liked,
        })}
      ></i>{" "}
      <span>{likeCount}</span>
    </button>
  );
};
