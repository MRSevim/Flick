import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

export const ArticleItem = ({
  deleteLoading,
  likeLoading,
  user,
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
      <div className="card h-100 article-card">
        <div className="card-body">
          {myArticles && (
            <div>
              <input
                className="position-absolute top-0 start-0 m-1"
                type="checkbox"
                checked={value}
                onChange={handleCheckboxChange}
              />
              <button
                disabled={deleteLoading}
                onClick={() => {
                  deleteArticle(article._id);
                }}
                className="btn btn-danger position-absolute top-0 end-0 p-1 m-1"
              >
                <i className="bi bi-trash-fill"></i>
              </button>
              <button
                onClick={() => {
                  editArticle(article._id);
                }}
                className="btn btn-warning position-absolute bottom-0 end-0 p-1 m-1"
              >
                <i className="bi bi-pencil-fill"></i>
              </button>
            </div>
          )}
          {!isDraft && (
            <button
              onClick={() => {
                likeArticle(article._id);
              }}
              disabled={likeLoading}
              className="btn btn-info position-absolute bottom-0 start-0 p-1 m-1"
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
          )}
          <h5 className="card-title" title={article.title}>
            {" "}
            <Link
              to={(!isDraft ? "/article/" : "/draft/") + article._id}
              className="text-black text-decoration-none"
            >
              <span className=" hovered-link">
                {article.title.substring(0, 50)}
                {article.title.length > 50 && "..."}
              </span>
            </Link>
          </h5>
          <div className="mb-4">
            <p
              className="card-text article-card-body"
              dangerouslySetInnerHTML={{
                __html: article.content.substring(0, 200),
              }}
            ></p>
            {article.content.trim().length >= 200 ? (
              <p>
                <Link
                  to={(!isDraft ? "/article/" : "/draft/") + article._id}
                  className="text-black text-decoration-none"
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
