import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSearchAll } from "../Hooks/SearchHooks/UseSearchAll";

export const Search = () => {
  const params = new URLSearchParams(useLocation().search);
  const query = params.get("q");
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
    <div className="container mt-3">
      {isLoading ? (
        <div className=" d-flex justify-content-center">
          <div className="lds-ring">
            <div></div>
          </div>
        </div>
      ) : (
        <>
          <h2>Users</h2>
          {users?.length ? (
            <div className="mb-4 row g-3">
              {users.map((user) => (
                <div key={user._id} className="col col-12 col-md-6 col-lg-4">
                  <div className="card">
                    <div className="card-body d-flex align-items-center">
                      <img
                        src={user.image}
                        alt="profile-img-mini"
                        className="profile-img-mini me-2"
                      />
                      <Link
                        className="text-dark link-underline link-underline-opacity-0"
                        to={"/user/" + user.username}
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
                        <i className="bi bi-hand-thumbs-up"></i>
                        {" " +
                          article.likes.length +
                          (article.likes.length > 1 ? " likes" : " like")}
                      </span>
                      <Link
                        className="text-dark link-underline link-underline-opacity-0"
                        to={"/article/" + article._id}
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
