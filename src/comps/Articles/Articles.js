import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetArticles } from "../Hooks/ArticleHooks/UseGetArticles";
import ls from "localstorage-slim";
import { useUserContext } from "../Contexts/UserContext";
import { useDeleteArticle } from "../Hooks/ArticleHooks/UseDeleteArticle";

export const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [localUser, setLocalUser] = useState(null);
  const [myArticles, setMyArticles] = useState(null);
  const [user] = useUserContext();
  let { id } = useParams();
  const navigate = useNavigate();
  const { getArticles, isLoading } = useGetArticles();
  const { deleteArticle: deleteArticleCall } = useDeleteArticle();

  const deleteArticle = async (id) => {
    const response = await deleteArticleCall(id);
    if (response.ok) {
      setArticles(
        articles.filter((article) => {
          return article._id !== id;
        })
      );
    }
  };

  const editArticle = (id) => {
    navigate("/article/edit/" + id);
  };

  useEffect(() => {
    const get = async () => {
      const { response, json } = await getArticles(id);
      if (response.ok) {
        setArticles(json.articles);
        setLocalUser(json.user);
      }
    };
    get();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setArticles, setLocalUser]);

  useEffect(() => {
    const userStorage = JSON.parse(ls.get("user"));

    if (userStorage && localUser) {
      if (userStorage._id === localUser._id) {
        setMyArticles(true);
      } else {
        setMyArticles(false);
      }
    }
    if (!user) {
      setMyArticles(false);
    }
  }, [user, localUser, setMyArticles]);

  return isLoading ? (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="lds-ring">
        <div></div>
      </div>
    </div>
  ) : localUser && articles ? (
    <div className="container mt-5">
      <h1 className="text-center">{localUser.username}'s Articles</h1>
      <div className="row g-3">
        {articles.length === 0 && <div>No articles to show.</div>}
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
