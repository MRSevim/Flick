import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useGetArticles } from "../Hooks/ArticleHooks/UseGetArticles";
import { useUserContext } from "../Contexts/UserContext";
import { useDeleteArticle } from "../Hooks/ArticleHooks/UseDeleteArticle";
import { useLikeArticle } from "../Hooks/LikeHooks/UseLikeArticle";
import { Pagination } from "@mui/material";
import classNames from "classnames";
import { ArticleItem } from "./ArticleItem";
import { useDeleteMany } from "../Hooks/ArticleHooks/UseDeleteMany";

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
  const { deleteMany, isLoading: deleteManyLoading } = useDeleteMany();
  const [totalPages, setTotalPages] = useState(null);
  const params = new URLSearchParams(useLocation().search);
  const page = params.get("page");
  const [selected, setSelected] = useState([]);

  function handleSelect(value, id) {
    if (value) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((item) => item !== id));
    }
  }

  function selectAll() {
    if (selected.length !== articles.length) {
      const ids = articles.map((article) => article._id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  }

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

  const deleteSelected = async (selected) => {
    const response = await deleteMany(selected);
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
    if (totalPages && articles.length === 0) {
      navigate({ search: "?page=" + totalPages });
    }
  }, [totalPages, articles, navigate]);

  useEffect(() => {
    setSelected([]);
  }, [articles]);

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
          <div>
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
            {myArticles && (
              <>
                <input
                  id="selectAll"
                  type="checkbox"
                  checked={selected.length === articles.length}
                  onChange={() => {
                    selectAll(selected.length === articles.length);
                  }}
                />{" "}
                <label htmlFor="selectAll">Select all</label>
                <button
                  disabled={deleteManyLoading}
                  onClick={(e) => {
                    deleteSelected(selected);
                  }}
                  className="btn btn-danger ms-2"
                >
                  <i className="bi bi-trash-fill"></i> Delete Selected
                </button>
              </>
            )}
          </div>
        )}
        {articles.map((article) => (
          <ArticleItem
            updateValue={handleSelect}
            value={selected.includes(article._id)}
            likeLoading={likeLoading}
            deleteLoading={deleteLoading}
            user={user}
            key={article._id}
            article={article}
            isDraft={isDraft}
            myArticles={myArticles}
            editArticle={editArticle}
            deleteArticle={deleteArticle}
            likeArticle={likeArticle}
          />
        ))}
      </div>
    </div>
  ) : (
    <div></div>
  );
};
