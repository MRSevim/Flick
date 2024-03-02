import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useGetArticles } from "../Hooks/ArticleHooks/UseGetArticles";
import ls from "localstorage-slim";
import { useUserContext } from "../Contexts/UserContext";
import { useDeleteArticle } from "../Hooks/ArticleHooks/UseDeleteArticle";
import { Pagination } from "@mui/material";

export const Articles = ({ isDraft }) => {
  const [articles, setArticles] = useState([]);
  const [localUser, setLocalUser] = useState(null);
  const [myArticles, setMyArticles] = useState(null);
  const userStorage = JSON.parse(ls.get("user"));
  const [user] = useUserContext();
  let { id } = useParams();
  const navigate = useNavigate();
  const { getArticles, isLoading, setIsLoading } = useGetArticles();
  const { deleteArticle: deleteArticleCall } = useDeleteArticle();
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
    navigate("/article/edit/" + id);
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
    if (userStorage) {
      if (userStorage._id === id) {
        setMyArticles(true);
      } else {
        setMyArticles(false);
      }
    }
    if (user === undefined) {
      setMyArticles(false);
    }
  }, [user, id, setMyArticles, userStorage]);

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
                className={
                  !isDraft
                    ? "active text-light link-underline link-underline-opacity-0 me-2 text-light"
                    : "text-light link-underline link-underline-opacity-0 me-2 text-light"
                }
              >
                Articles
              </Link>
              <Link
                onClick={setLoadingToTrue}
                to={`/article/user/${id}/drafts`}
                className={
                  isDraft
                    ? "active text-light link-underline link-underline-opacity-0"
                    : "text-light link-underline link-underline-opacity-0"
                }
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
          <div>No articles to show.</div>
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
              to={"/article/" + article._id}
              className="text-black text-decoration-none"
            >
              <div className="card h-100 article-card">
                <div className="card-body">
                  {myArticles && (
                    <div>
                      <button
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
                  <h5 className="card-title">{article.title}</h5>
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
            </Link>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div></div>
  );
};
