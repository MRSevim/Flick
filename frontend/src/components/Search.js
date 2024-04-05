import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSearchAll } from "../Hooks/SearchHooks/UseSearchAll";
import { LoadingRing } from "./LoadingRing";
import links from "../Utils/Links";
import { ImageComponent } from "./ImageComponent";
import { AdvancedSearch } from "./AdvancedSearch";

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [users, setUsers] = useState(null);
  const [articles, setArticles] = useState(null);
  const { searchAll, isLoading } = useSearchAll();

  useEffect(() => {
    const get = async () => {
      const json = await searchAll(query);
      setArticles(json.articles);
      setUsers(json.users);
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="container mt-5">
      <AdvancedSearch
        setSearchParams={setSearchParams}
        setArticles={setArticles}
        setUsers={setUsers}
      />
      {isLoading ? (
        <LoadingRing />
      ) : (
        <>
          <h2>Users</h2>
          {users?.length ? (
            <div className="mb-4 row g-3">
              {users.map((user) => (
                <div key={user._id} className="col col-12 col-md-6 col-lg-4">
                  <div className="card">
                    <div className="card-body d-flex align-items-center">
                      <ImageComponent
                        src={user.image}
                        type={"mini"}
                        classes={"me-2"}
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
            <div className="mb-4 row g-3">
              {articles.map((article) => (
                <div key={article._id} className="col col-12 col-md-6 col-lg-4">
                  <div className="card">
                    <div className="card-body">
                      <span className="line-right">
                        <i className="bi bi-hand-thumbs-up h5"></i>
                        {" " +
                          article.likes.length +
                          (article.likes.length > 1 ? " likes" : " like")}
                      </span>
                      {article.tags.map((tag, i) => (
                        <Link key={i} className="me-1">
                          #{tag}
                        </Link>
                      ))}
                      <Link
                        className="unstyled-link"
                        to={links.article(article._id)}
                      >
                        <h5 className="card-title m-0 search-card-text">
                          {article.title}
                        </h5>
                      </Link>
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
