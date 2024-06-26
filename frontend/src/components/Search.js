import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSearchAll } from "../Hooks/SearchHooks/UseSearchAll";
import { LoadingRing } from "./LoadingRing";
import links from "../Utils/Links";
import { ImageComponent } from "./ImageComponent";
import { AdvancedSearch } from "./AdvancedSearch";
import { LikeButton } from "./Articles/LikeButton";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { addDarkBg } from "../Utils/HelperFuncs";

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [users, setUsers] = useState(null);
  const [articles, setArticles] = useState(null);
  const { searchAll, isLoading } = useSearchAll();
  const advancedSearchString = searchParams.get("advancedSearch");
  const advancedSearch = advancedSearchString === "true";
  const [advancedLoading, setAdvancedLoading] = useState(true);
  const [darkMode] = useDarkModeContext();

  useEffect(() => {
    const get = async () => {
      const json = await searchAll(query);

      setArticles(json.articles);
      setUsers(json.users);
    };

    if (!advancedSearch) {
      get();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="container">
      <AdvancedSearch
        passLoading={(state) => {
          setAdvancedLoading(state);
        }}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setArticles={setArticles}
        setUsers={setUsers}
      />
      {isLoading || advancedLoading ? (
        <LoadingRing />
      ) : (
        <>
          <h2>Users</h2>
          {users?.length ? (
            <div className="mb-4 row g-3">
              {users.map((user) => (
                <div key={user._id} className="col col-12 col-md-6 col-lg-4">
                  <div className={"card " + addDarkBg(darkMode)}>
                    <div className="card-body d-flex align-items-center">
                      <ImageComponent
                        src={user.image}
                        classes={"profile-img-mini me-2"}
                      />
                      <Link
                        className="unstyled-link"
                        to={links.publicUser(user._id)}
                      >
                        <h5 className="card-title m-0 search-card-text">
                          {user.username}
                        </h5>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4">No users to display</div>
          )}
          <h2>Articles</h2>
          {articles?.length ? (
            <div className="pb-4 row g-3">
              {articles.map((article) => (
                <div key={article._id} className="col col-12 col-md-6 col-lg-4">
                  <div
                    className={
                      "card text-info " +
                      addDarkBg(darkMode) +
                      (darkMode && " text-white")
                    }
                  >
                    <div className="card-body">
                      <span className="line-right ">
                        <LikeButton
                          classes="p-1 m-1 bg-secondary"
                          article={article}
                        />
                      </span>
                      {article.tags.map((tag, i) => (
                        <Link key={i} className="me-1">
                          #{tag}
                        </Link>
                      ))}
                      <p className="my-2">
                        <Link
                          className="unstyled-link"
                          to={links.article(article._id)}
                        >
                          <span className="card-title m-0 search-card-text">
                            {article.title}
                          </span>
                        </Link>
                      </p>
                      <div>
                        written by
                        <Link
                          className="fw-bold ms-1"
                          to={links.publicUser(article.user._id)}
                        >
                          {article.user.username}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4">No articles to display</div>
          )}
        </>
      )}
    </div>
  );
};
