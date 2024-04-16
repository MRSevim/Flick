import React from "react";
import { Link } from "react-router-dom";
import { LikeButton } from "./LikeButton";
import { EditButton } from "./EditButton";
import { DeleteButton } from "./DeleteButton";
import links from "../../Utils/Links";
import { getFirstDiv } from "../../Utils/HelperFuncs";
import { ImageComponent } from "../ImageComponent";

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
        <div className="card-body my-4">
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
          <div className="my-2 image-wrapper">
            <ImageComponent src={article.image} classes="mw-100 h-100" />
          </div>
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
              <Link to={links.tag(tag)} key={i} className="me-1">
                #{tag}
              </Link>
            );
          })}
          <div>
            <p
              className="card-text article-card-inner-html"
              dangerouslySetInnerHTML={{
                __html: getFirstDiv(article.content.trim()),
              }}
            ></p>

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
          </div>
        </div>
      </div>
    </div>
  );
};
