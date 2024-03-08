import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useGetArticles } from "../Hooks/ArticleHooks/UseGetArticles";
import { useUserContext } from "../Contexts/UserContext";
import { useDeleteArticle } from "../Hooks/ArticleHooks/UseDeleteArticle";
import { useLikeArticle } from "../Hooks/LikeHooks/UseLikeArticle";
import { Pagination } from "@mui/material";
import classNames from "classnames";

export const Articles = ({ isDraft }) => {
  const [articles, setArticles] = useState([]);
  const [localUser, setLocalUser] = useState(null);
  const [myArticles, setMyArticles] = useState(null);
  const [user] = useUserContext();
  let { id } = useParams();
  const navigate = useNavigate();
  const { getArticles, isLoading, setIsLoading } = useGetArticles();
  const { deleteArticle: deleteArticleCall, isLoading: deleteLoading } =
    useDeleteArticle();
  const { likeArticle: likeArticleCall, isLoading: likeLoading } =
    useLikeArticle();
  const [totalPages, setTotalPages] = useState(null);
  const params = new URLSearchParams(useLocation().search);
  const page = params.get("page");

  const deleteArticle = async (_id) => {
    const response = await deleteArticleCall(_id);
    if (response.ok) {
      const { response, json } = await getArticles(id, page, isDraft);
      if (response.ok) {
        setTotalPages(json.totalPages);
        setArticles(json.articles);
        setLocalUser(json.user);
      }
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
      setArticles(
        articles.map((article) => {
          if (article._id === json.updatedArticle._id) {
            return json.updatedArticle;
          } else {
            return article;
          }
        })
      );
    }
  };

  const handlePaginationChange = (event, value) => {
    navigate({ search: "?page=" + value });
  };

  const setLoadingToTrue = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    const get = async () => {
      if (!page) {
        navigate({ search: "?page=1" });
        return;
      }
      const { response, json } = await getArticles(id, page, isDraft);
      if (response.ok) {
        setTotalPages(json.totalPages);
        setArticles(json.articles);
        setLocalUser(json.user);
      }
    };
    get();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setArticles, setLocalUser, page, isDraft]);

  useEffect(() => {
    if (user?._id === id) {
      setMyArticles(true);
    } else {
      setMyArticles(false);
    }
  }, [user, id, setMyArticles]);

  useEffect(() => {
    if (myArticles === false && isDraft) {
      navigate(`/article/user/${id}/articles`);
    }
  }, [myArticles, isDraft, navigate, id]);

  return isLoading ? (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="lds-ring">
        <div></div>
      </div>
    </div>
  ) : localUser && articles ? (
    <div className="container mt-5">
      <h1 className="text-center">{localUser.username}'s Articles</h1>
      {myArticles && (
        <>
          <div className="d-flex justify-content-center align-items-center">
            <div className="d-flex justify-content-center align-items-center mb-2 wide-input rounded bg-secondary">
              <Link
                onClick={setLoadingToTrue}
                to={`/article/user/${id}/articles`}
                className={classNames({
                  "text-light link-underline link-underline-opacity-0 me-2": true,
                  active: !isDraft,
                })}
              >
                Articles
              </Link>
              <Link
                onClick={setLoadingToTrue}
                to={`/article/user/${id}/drafts`}
                className={classNames({
                  "text-light link-underline link-underline-opacity-0": true,
                  active: isDraft,
                })}
              >
                Drafts
              </Link>
            </div>
          </div>
          {!isDraft && (
            <p className="text-center mb-2">
              Articles are your released writings that are seen by everyone.
            </p>
          )}
          {isDraft && (
            <p className="text-center mb-2">
              Drafts are preliminary versions of your writings. No one else has
              access to view them.
            </p>
          )}
        </>
      )}
      <div className="row g-3">
        {articles.length === 0 ? (
          <div>No {!isDraft ? "articles" : "drafts"} to show.</div>
        ) : (
          <div className="d-flex justify-content-center">
            <Pagination
              page={Number(page)}
              showFirstButton
              showLastButton
              count={totalPages}
              shape="rounded"
              onChange={handlePaginationChange}
            />
          </div>
        )}
        {articles.map((article) => (
          <div
            key={article._id}
            className="col col-12 col-md-6 col-lg-4 articles-column"
          >
            <Link
              to={(!isDraft ? "/article/" : "/draft/") + article._id}
              className="text-black text-decoration-none"
            >
              <div className="card h-100 article-card">
                <div className="card-body">
                  {myArticles && (
                    <div>
                      <button
                        disabled={deleteLoading}
                        onClick={(e) => {
                          e.preventDefault();
                          deleteArticle(article._id);
                        }}
                        className="btn btn-danger position-absolute top-0 end-0 p-1 m-1"
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
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
                      onClick={(e) => {
                        e.preventDefault();
                        likeArticle(article._id);
                      }}
                      disabled={likeLoading}
                      className="btn btn-info position-absolute bottom-0 start-0 p-1 m-1"
                    >
                      <i
                        className={classNames({
                          bi: true,
                          "bi-hand-thumbs-up": article.likes.every((like) => {
                            return like.user !== user._id;
                          }),
                          "bi-hand-thumbs-up-fill": article.likes.some(
                            (like) => {
                              return like.user === user._id;
                            }
                          ),
                        })}
                      ></i>{" "}
                      <span>{article.likes.length}</span>
                    </button>
                  )}
                  <h5 className="card-title">{article.title}</h5>
                  <div className="mb-4">
                    <p
                      className="card-text article-card-body"
                      dangerouslySetInnerHTML={{
                        __html: article.content.substring(0, 200),
                      }}
                    ></p>
                    {article.content.trim().length >= 200 ? (
                      <p>Read more...</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div></div>
  );
};
