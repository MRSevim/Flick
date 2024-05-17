import React, { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useGetArticles } from "../../Hooks/ArticleHooks/UseGetArticles";
import { useUserContext } from "../../Contexts/UserContext";
import { useDeleteArticle } from "../../Hooks/ArticleHooks/UseDeleteArticle";
import { useLikeArticle } from "../../Hooks/LikeHooks/UseLikeArticle";
import { Pagination } from "@mui/material";
import classNames from "classnames";
import { ArticleItem } from "./ArticleItem";
import { useDeleteMany } from "../../Hooks/ArticleHooks/UseDeleteMany";
import { LoadingRing } from "../LoadingRing";
import links from "../../Utils/Links";
import { AdvancedSearch } from "../AdvancedSearch";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const advancedSearchString = searchParams.get("advancedSearch");
  const advancedSearch = advancedSearchString === "true";
  const titleParam = searchParams.get("title");
  const tagsParam = searchParams.get("tags");
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

  const deleteArticle = async (_id, title) => {
    const response = await deleteArticleCall(_id, title);

    if (response && response.ok) {
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
    if (response && response.ok) {
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
      navigate(links.edit(id, true));
    } else {
      navigate(links.edit(id, false));
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
      searchParams.set("page", totalPages);
      setSearchParams(searchParams);
    }
  }, [totalPages, articles, navigate, searchParams, setSearchParams]);

  useEffect(() => {
    setSelected([]);
  }, [articles]);

  useEffect(() => {
    const get = async () => {
      if (!page) {
        navigate({ search: "?page=1" });
        return;
      }
      const { response, json } = await getArticles(
        id,
        page,
        isDraft,
        advancedSearch,
        titleParam,
        tagsParam
      );
      if (response.ok) {
        setTotalPages(json.totalPages);
        setArticles(json.articles);
        setLocalUser(json.user);
      }
    };
    get();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setArticles, setLocalUser, isDraft, searchParams]);

  useEffect(() => {
    if (user?._id === id) {
      setMyArticles(true);
    } else {
      setMyArticles(false);
    }
  }, [user, id, setMyArticles]);

  useEffect(() => {
    if (myArticles === false && isDraft) {
      navigate(links.allArticles(id));
    }
  }, [myArticles, isDraft, navigate, id]);

  return isLoading ? (
    <div className="container mt-5 ">
      <LoadingRing />
    </div>
  ) : localUser && articles ? (
    <div className="container mt-5 pb-4">
      <h1 className="text-center"> All of {localUser.username}'s Articles</h1>
      {myArticles && (
        <>
          <div className="d-flex justify-content-center align-items-center">
            <div className="d-flex justify-content-center align-items-center mb-2 wide-input rounded bg-primary">
              <Link
                onClick={setLoadingToTrue}
                to={links.allArticles(id)}
                className={classNames({
                  "unstyled-link me-2": true,
                  active: !isDraft,
                })}
              >
                Articles
              </Link>
              <Link
                onClick={setLoadingToTrue}
                to={links.allDrafts(id)}
                className={classNames({
                  "unstyled-link": true,
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
          <h2 className="text-center mt-3 no-articles-background rounded-pill">
            <div className="d-flex align-items-center justify-content-center text-white font-secondary h-100">
              {!isDraft && "No articles."}
              {isDraft && "No Drafts."}
            </div>
          </h2>
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
              <div className="mt-3">
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
                  disabled={deleteManyLoading || deleteLoading}
                  onClick={(e) => {
                    deleteSelected(selected);
                  }}
                  className="btn btn-danger ms-2"
                >
                  <i className="bi bi-trash-fill"></i> Delete Selected
                </button>
              </div>
            )}
          </div>
        )}
        {articles.map((article) => (
          <ArticleItem
            updateValue={handleSelect}
            value={selected.includes(article._id)}
            likeLoading={likeLoading}
            deleteLoading={deleteManyLoading || deleteLoading}
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

      <AdvancedSearch
        page={page}
        className="mt-5"
        _username={localUser.username}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </div>
  ) : (
    <div></div>
  );
};
