"use client";
import { useRef } from "react";
import Link from "next/link";
import { useUserContext } from "@/contexts/UserContext";
import { DeleteButton } from "../DeleteButton";
import { EditButton } from "../EditButton";
import { LikeButton } from "../LikeButton";
import links from "@/utils/Links";
import { Image } from "../Image";
import { ArticleSections } from "./ArticleSections";
import { jost } from "../ArticleCardBody";
import { CommentSection } from "./CommentSection";
import { SimilarArticles } from "./SimilarArticles";
import { Share } from "./Share";
import "./Article.css";

export const Article = ({ json, similar, error }) => {
  const [user] = useUserContext();
  const ref = useRef(null);
  const article = json;
  const createdAt = new Date(json.createdAt).toLocaleString();
  const updatedAt = new Date(json.updatedAt).toLocaleString();
  const myArticle = article.user._id === user?._id;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-12 col-lg-2">
          <ArticleSections refProp={ref} />
        </div>
        <div className="col col-12 col-lg-8">
          <div className="article">
            <Image src={article.image} classes="mw-100 w-auto h-auto" />
            <h1 className={"display-3 " + jost.className}>{article.title}</h1>
            <div className="my-2">
              {article.tags?.map((tag, i) => {
                return (
                  <Link href={links.tag(tag)} key={i} className="me-1 ">
                    #{tag}
                  </Link>
                );
              })}
            </div>
            <div className="mb-2 d-flex">
              <LikeButton classes="me-1" article={article} />
              {(myArticle ||
                user?.role === "mod" ||
                user?.role === "admin") && (
                <DeleteButton classes="me-1" article={article} />
              )}
              {myArticle && (
                <>
                  <EditButton
                    classes="me-1"
                    href={links.edit(article._id, false)}
                  />
                </>
              )}
            </div>
            <article
              ref={ref}
              className={"mb-2 " + jost.className}
              dangerouslySetInnerHTML={{
                __html: article.content,
              }}
            ></article>
            <div className="d-flex justify-content-between my-4">
              <Share article={article} />
              <div>
                <p>
                  <i>
                    Written by{" "}
                    <Link href={links.publicUser(article.user?._id)}>
                      <span className="fw-bold">{article.user?.username}</span>
                    </Link>
                  </i>
                </p>
                <p>
                  <i>
                    Published <span className="fw-bold">{createdAt}</span>
                  </i>
                </p>
                {createdAt !== updatedAt && (
                  <p>
                    <i>
                      Last updated <span className="fw-bold">{updatedAt}</span>
                    </i>
                  </p>
                )}
              </div>
            </div>
          </div>
          <SimilarArticles similar={similar} error={error} />
          <CommentSection article={article} />
        </div>

        <div className="col col-12 col-lg-2 "></div>
      </div>
    </div>
  );
};
