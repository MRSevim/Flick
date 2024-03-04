import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArticleSections } from "./ArticleSections";
import { useGetArticle } from "../Hooks/ArticleHooks/UseGetArticle";
import { useDeleteArticle } from "../Hooks/ArticleHooks/UseDeleteArticle";
import { useUserContext } from "../Contexts/UserContext";

export const Article = ({ isDraft }) => {
  const [user] = useUserContext();
  const { id } = useParams();
  const ref = useRef(null);
  const navigate = useNavigate();
  const [sections, setSections] = useState(null);
  const { getArticle, isLoading } = useGetArticle();
  const [createdAt, setCreatedAt] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [article, setArticle] = useState(null);
  const [myArticle, setMyArticle] = useState(null);
  const { deleteArticle: deleteArticleCall, isLoading: deleteLoading } =
    useDeleteArticle();

  const deleteArticle = async (_id) => {
    const response = await deleteArticleCall(_id);
    if (response.ok) {
      navigate(
        "/article/user/" + user._id + (isDraft ? "/drafts" : "/articles")
      );
    }
  };

  const editArticle = (id) => {
    if (isDraft) {
      navigate("/draft/edit/" + id);
    } else {
      navigate("/article/edit/" + id);
    }
  };
  const likeArticle = (id) => {
    console.log(id);
  };

  useEffect(() => {
    const get = async () => {
      const { response, json } = await getArticle(id, isDraft);
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
    if (isDraft && myArticle === false) {
      navigate("/");
    }
  }, [isDraft, myArticle, navigate]);

  useEffect(() => {
    if (article) {
      if (article.user._id === user?._id) {
        setMyArticle(true);
      } else {
        setMyArticle(false);
      }
    }
  }, [article, user, setMyArticle]);

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
            <div>
              {!isDraft && (
                <button
                  onClick={() => {
                    likeArticle(article._id);
                  }}
                  className="btn btn-info me-1"
                >
                  <i className="bi bi-hand-thumbs-up"></i>{" "}
                  <span className="text-light">{article.likes.length}</span>
                </button>
              )}
              {myArticle && (
                <>
                  <button
                    disabled={deleteLoading}
                    onClick={() => {
                      deleteArticle(article._id);
                    }}
                    className="btn btn-danger me-1"
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                  <button
                    onClick={() => {
                      editArticle(article._id);
                    }}
                    className="btn btn-warning "
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                </>
              )}
            </div>
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
