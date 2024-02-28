import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArticleSections } from "./ArticleSections";
import { useGetArticle } from "../Hooks/ArticleHooks/UseGetArticle";

export const Article = () => {
  const { id } = useParams();
  const ref = useRef(null);
  const [sections, setSections] = useState(null);
  const { getArticle, isLoading } = useGetArticle();
  const [createdAt, setCreatedAt] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const get = async () => {
      const { response, json } = await getArticle(id);
      if (response.ok) {
        setArticle(json);
        const created = new Date(json?.createdAt);
        setCreatedAt(created.toLocaleString());
        const updated = new Date(json?.updatedAt);
        setUpdatedAt(updated.toLocaleString());
      }
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    let headers = [];
    let initialId = 0;
    if (article) {
      ref.current
        .querySelectorAll("h1, h2, h3, h4, h5, h6")
        .forEach((element) => {
          element.id = initialId++;
          headers.push(element);
        });
      if (ref.current.innerHTML) {
        setSections(headers);
      }
    }
  }, [id, article, setSections]);

  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="col col-12 col-lg-2">
          <h3 className="">Sections</h3>
          <ArticleSections sections={sections} />
        </div>
        {isLoading ? (
          <div className="article col">
            <div className="container mt-5 d-flex justify-content-center">
              <div className="lds-ring">
                <div></div>
              </div>
            </div>
          </div>
        ) : article ? (
          <div className="article col">
            <h1 className="display-4">{article.title}</h1>
            <article
              ref={ref}
              className="article-body"
              dangerouslySetInnerHTML={{
                __html: article.content,
              }}
            ></article>
            <div className="text-end">
              <p>
                <i>
                  Written by{" "}
                  <span className="fw-bold">{article.user.username}</span>
                </i>
              </p>
              <p>
                <i>
                  Publish <span className="fw-bold">{createdAt}</span>
                </i>
              </p>
              <p>
                <i>
                  Last update <span className="fw-bold">{updatedAt}</span>
                </i>
              </p>
            </div>
          </div>
        ) : (
          <div className="article col"></div>
        )}
        <div className="col col-12 col-lg-2 border border-dark">
          <h3 className="">Extra Space</h3>
        </div>
      </div>
    </div>
  );
};
