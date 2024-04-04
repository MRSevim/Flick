import React from "react";
import { Link } from "react-router-dom";
import { LikeButton } from "./LikeButton";
import { EditButton } from "./EditButton";
import { DeleteButton } from "./DeleteButton";
import links from "../../Utils/Links";

export const ArticleItem = ({
  deleteLoading,
  likeLoading,
  article,
  isDraft,
  myArticles,
  editArticle,
  deleteArticle,
  likeArticle,
  value = false,
  updateValue = () => {},
}) => {
  const handleCheckboxChange = () => {
    updateValue(!value, article._id);
  };

  return (
    <div
      key={article._id}
      className="col col-12 col-md-6 col-lg-4 articles-column"
    >
      <div className="card h-100 article-card shadow">
        <div className="card-body">
          {myArticles && (
            <div>
              <input
                className="position-absolute top-0 start-0 m-1"
                type="checkbox"
                checked={value}
                onChange={handleCheckboxChange}
              />
              <DeleteButton
                classes="p-1 m-1 position-absolute top-0 end-0"
                onClick={() => {
                  deleteArticle(article._id);
                }}
                deleteLoading={deleteLoading}
              />
              <EditButton
                classes="p-1 m-1 position-absolute bottom-0 end-0"
                onClick={() => {
                  editArticle(article._id);
                }}
              />
            </div>
          )}
          {!isDraft && (
            <LikeButton
              classes="p-1 m-1 position-absolute bottom-0 start-0"
              article={article}
              onClick={() => {
                likeArticle(article._id);
              }}
              likeLoading={likeLoading}
            />
          )}
          <h5 className="card-title" title={article.title}>
            {" "}
            <Link
              to={
                !isDraft
                  ? links.article(article._id)
                  : links.edit(article._id, true)
              }
              className="unstyled-link"
            >
              <span className=" hovered-link">
                {article.title.substring(0, 50)}
                {article.title.length > 50 && "..."}
              </span>
            </Link>
          </h5>
          {article.tags?.map((tag, i) => {
            return (
              <Link key={i} className="me-1">
                #{tag}
              </Link>
            );
          })}
          <div className="mb-4">
            <p
              className="card-text article-card-body"
              dangerouslySetInnerHTML={{
                __html: article.content.trim().substring(0, 400),
              }}
            ></p>
            {article.content.trim().length >= 400 ? (
              <p>
                <Link
                  to={
                    !isDraft
                      ? links.article(article._id)
                      : links.edit(article._id, true)
                  }
                  className="unstyled-link"
                >
                  <span className="hovered-link">Read more...</span>
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
