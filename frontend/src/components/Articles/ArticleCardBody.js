import React from "react";
import links from "../../Utils/Links";
import { Link } from "react-router-dom";
import { getExcerpt } from "../../Utils/HelperFuncs";

export const ArticleCardBody = ({ classes, article, link, children = [] }) => {
  return (
    <div className={"card-body " + classes}>
      <h5 className="card-title" title={article.title}>
        {children}{" "}
        <Link to={link} className="unstyled-link">
          <span className=" hovered-link">
            {article.title.substring(0, 50)}
            {article.title.length > 50 && "..."}
          </span>
        </Link>
      </h5>
      <div className="mb-2">
        {article.tags?.map((tag, i) => {
          return (
            <Link to={links.tag(tag)} key={i} className="me-1">
              #{tag}
            </Link>
          );
        })}
      </div>
      <div>
        <p
          className="card-text article-card-inner-html"
          dangerouslySetInnerHTML={{
            __html: getExcerpt(article.content.trim()),
          }}
        ></p>

        <Link to={link} className="unstyled-link ">
          <span className="hovered-link">Read more...</span>
        </Link>
      </div>
    </div>
  );
};
