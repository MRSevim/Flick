"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { Pagination } from "@mui/material";
import classNames from "classnames";
import { ArticleItem } from "./ArticleItem";
import links from "@/utils/Links";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { addDarkBg, confirmationWrapper } from "@/utils/HelperFuncs";
import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";
import { useConfirmationContext } from "@/contexts/ConfirmationContext";
import Link from "next/link";

export const Articles = ({ json, isDraft }) => {
  const username = json.user.username;
  const articles = json.articles;
  const [user] = useUserContext();
  const id = json.user._id;
  const myArticles = user?._id === id;
  const page = +json.currentPage;
  const totalPages = +json.totalPages;

  /*   const { deleteArticle: deleteArticleCall, isLoading: deleteLoading } =
    useDeleteArticle();
  const { deleteMany, isLoading: deleteManyLoading } = useDeleteMany(); */

  const [selected, setSelected] = useState([]);
  const { confirmation, setConfirmation } = useConfirmationContext();
  const [darkMode] = useDarkModeContext();
  const [, setGlobalError] = useGlobalErrorContext();

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

  const deleteArticle = async (_id, title, ownArticle) => {
    /*   confirmationWrapper(
      confirmation,
      (prev) => {
        return {
          ...confirmation,
          type: "deleteArticle",
          info: {
            ...prev.info,
            owned: ownArticle,
            title,
          },
        };
      },
      setConfirmation,
      async (reason) => {
        return await deleteArticleCall(_id, reason);
      },
      () => {
        setConfirmation((prev) => ({
          ...prev,
          info: { ...prev.info, reason: "" },
        }));
        get();
      }
    ); */
  };

  const deleteSelected = async (selected) => {
    /*     if (selected.length === 0) {
      setGlobalError("Please select at least 1 article");
      return;
    }
    confirmationWrapper(
      confirmation,
      (prev) => {
        return {
          ...confirmation,

          type: "deleteManyArticles",
          info: {
            ...prev.info,
            size: selected.length,
          },
        };
      },
      setConfirmation,
      async () => {
        return await deleteMany(selected);
      },
      () => {
        get();
      }
    ); */
  };

  const editArticle = (id) => {
    if (isDraft) {
      navigate(links.edit(id, true));
    } else {
      navigate(links.edit(id, false));
    }
  };

  const handlePaginationChange = (event, value) => {
    /*     searchParams.set("page", value);
    setSearchParams(searchParams); */
  };

  /*   useEffect(() => {
    if (totalPages && articles.length === 0) {
      searchParams.set("page", totalPages);
      setSearchParams(searchParams);
    }
  }, [totalPages, articles, searchParams, setSearchParams]); */

  useEffect(() => {
    setSelected([]);
  }, [articles]);

  /*   useEffect(() => {
    if (myArticles === false && isDraft) {
      navigate(links.allArticles(id));
    }
  }, [myArticles, isDraft, navigate, id]); */

  return (
    <div className="container">
      <h1 className="text-center"> All of {username}'s Articles</h1>
      {myArticles && (
        <>
          <div className="d-flex justify-content-center align-items-center">
            <div
              className={
                "d-flex justify-content-center align-items-center mb-2 p-3 rounded bg-primary " +
                addDarkBg(darkMode)
              }
            >
              <Link
                href={links.allArticles(id)}
                className={classNames({
                  "unstyled-link mx-2": true,
                  active: !isDraft,
                })}
              >
                Articles
              </Link>
              <Link
                href={links.allDrafts(id)}
                className={classNames({
                  "unstyled-link mx-2": true,
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
      <div className="mb-3">
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
              <div className="mt-3 form-check">
                <input
                  id="selectAll"
                  className="form-check-input"
                  type="checkbox"
                  checked={selected.length === articles.length}
                  onChange={() => {
                    selectAll();
                  }}
                />{" "}
                <label className="form-check-label" htmlFor="selectAll">
                  Select all
                </label>
                <button
                  /*   disabled={deleteManyLoading || deleteLoading} */
                  onClick={(e) => {
                    deleteSelected(selected);
                  }}
                  className="btn btn-danger ms-4"
                >
                  <i className="bi bi-trash-fill"></i> Delete Selected
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="row g-3 flex-wrap-reverse">
        {articles
          .slice()
          .reverse()
          .map((article) => (
            <ArticleItem
              user={user}
              updateValue={handleSelect}
              value={selected.includes(article._id)}
              deleteLoading={/* deleteManyLoading || deleteLoading */ false}
              key={article._id}
              article={article}
              isDraft={isDraft}
              myArticles={myArticles}
              editArticle={editArticle}
              deleteArticle={deleteArticle}
            />
          ))}
      </div>

      {/*   <AdvancedSearch
        page={page}
        className="mt-5"
        _username={localUser.username}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      /> */}
    </div>
  );
};
