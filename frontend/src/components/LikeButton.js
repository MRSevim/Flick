"use client";
import { useState } from "react";
import classNames from "classnames";
import { useUserContext } from "@/contexts/UserContext";
import { likeCall } from "@/utils/ApiCalls/LikeApiFunctions";
import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";

export const LikeButton = ({ article, classes }) => {
  const [user] = useUserContext();
  const [, setGlobalError] = useGlobalErrorContext();
  const [isLoading, setIsLoading] = useState(null);
  const liked = article.likes.some((like) => {
    return like.user === user?._id;
  });

  const likeCount = +article.likes.length;

  const likeArticle = async () => {
    setIsLoading(true);
    const error = await likeCall(article._id);
    if (error) {
      setGlobalError(error);
    }
    setIsLoading(false);
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
