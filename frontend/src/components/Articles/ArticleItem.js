import React from "react";
import { LikeButton } from "./LikeButton";
import { EditButton } from "./EditButton";
import { DeleteButton } from "./DeleteButton";
import links from "../../Utils/Links";
import { ImageComponent } from "../ImageComponent";
import { ArticleCardBody } from "./ArticleCardBody";

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
      <div className="card h-100 article-card">
        <ArticleCardBody
          classes={"my-4"}
          article={article}
          link={
            !isDraft
              ? links.article(article._id)
              : links.edit(article._id, true)
          }
        >
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
                  deleteArticle(article._id, article.title);
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
        </ArticleCardBody>
      </div>
    </div>
  );
};
