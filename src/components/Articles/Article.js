import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArticleSections } from "./ArticleSections";
import { useGetArticle } from "../../Hooks/ArticleHooks/UseGetArticle";
import { useDeleteArticle } from "../../Hooks/ArticleHooks/UseDeleteArticle";
import { useUserContext } from "../../Contexts/UserContext";
import { useLikeArticle } from "../../Hooks/LikeHooks/UseLikeArticle";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

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
  const { likeArticle: likeArticleCall, isLoading: likeLoading } =
    useLikeArticle();

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
  const likeArticle = async (id) => {
    const { response, json } = await likeArticleCall(id);
    if (response.ok) {
      setArticle(json.updatedArticle);
    }
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
  }, [id, isDraft]);

  useEffect(() => {
    if (isDraft && myArticle === false) {
      navigate("/");
    }
  }, [isDraft, myArticle, navigate]);

  useEffect(() => {
    if (article) {
      if (article.user?._id === user?._id) {
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
    <div className="container mt-3 pb-4">
      <div className="row justify-content-center">
        {article && (
          <div className="col col-12 col-lg-2">
            <h3 className="">Sections</h3>
            <ArticleSections sections={sections} />
          </div>
        )}
        {isLoading ? (
          <div className="article col">
            <div className="container mt-5 d-flex justify-content-center">
              <div className="lds-ring">
                <div></div>
              </div>
            </div>
          </div>
        ) : article ? (
          <div className="article col col-12 col-lg-8 mt-2">
            <h1 className="article-title">{article.title}</h1>
            <div>
              {!isDraft && (
                <LikeButton
                  classes="me-1"
                  article={article}
                  onClick={() => {
                    likeArticle(article._id);
                  }}
                  likeLoading={likeLoading}
                />
              )}
              {myArticle && (
                <>
                  <DeleteButton
                    classes="me-1"
                    onClick={() => {
                      deleteArticle(article._id);
                    }}
                    deleteLoading={deleteLoading}
                  />
                  <EditButton
                    classes="me-1"
                    onClick={() => {
                      editArticle(article._id);
                    }}
                  />
                </>
              )}
            </div>
            <article
              ref={ref}
              className="article-body mb-2"
              dangerouslySetInnerHTML={{
                __html: article.content,
              }}
            ></article>
            <div className="text-end">
              <p>
                <i>
                  Written by{" "}
                  <Link
                    className="unstyled-link"
                    to={"/user/" + article.user?.username}
                  >
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
            <CommentSection article={article} />
          </div>
        ) : (
          <div className="article col"></div>
        )}
        {article && (
          <div className="col col-12 col-lg-2 border border-dark">
            <h3 className="">Extra Space</h3>
          </div>
        )}
      </div>
    </div>
  );
};
