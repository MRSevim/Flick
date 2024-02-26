import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetArticles } from "../Hooks/ArticleHooks/UseGetArticles";

export const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);
  let { id } = useParams();
  const { getArticles, isLoading } = useGetArticles();

  useEffect(() => {
    const get = async () => {
      const json = await getArticles(id);

      setArticles(json);
      setUser(json[0]?.user);
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="lds-ring">
        <div></div>
      </div>
    </div>
  ) : user ? (
    <div className="container mt-5">
      <h1 className="text-center">{user?.username}'s Articles</h1>
      <div className="row g-3">
        {articles.map((article) => (
          <div
            key={article._id}
            className="col col-12 col-md-6 col-lg-4 articles-column"
          >
            <Link
              to={"/articles/" + article._id}
              className="text-black text-decoration-none"
            >
              <div className="card h-100 article-card">
                <div className="card-body">
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
