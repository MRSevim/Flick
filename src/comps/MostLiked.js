import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetMostLiked } from "./Hooks/LikeHooks/UserGetMostLiked";

export const MostLiked = () => {
  const [time, setTime] = useState("week");
  const { getMostLiked, isLoading } = useGetMostLiked();
  const [articles, setArticles] = useState(null);
  useEffect(() => {
    const get = async (time) => {
      const { json } = await getMostLiked(time);
      setArticles(json);
    };

    get(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, setArticles]);

  return (
    <div className="container my-4 ">
      <section className="row g-3">
        <div className="col col-12 col-md-4 text-center">
          <div className="bg-warning">
            <div
              className="border-bottom pointer"
              onClick={() => {
                setTime("week");
              }}
            >
              Most Liked This Week
            </div>
            <div
              className="border-bottom pointer"
              onClick={() => {
                setTime("month");
              }}
            >
              Most Liked This Month
            </div>
            <div
              className="border-bottom pointer"
              onClick={() => {
                setTime("year");
              }}
            >
              Most Liked This Year
            </div>
          </div>
        </div>
        <div className="col col-12 col-md-8">
          {isLoading && (
            <div className="container mt-5 d-flex justify-content-center">
              <div className="lds-ring">
                <div></div>
              </div>
            </div>
          )}
          {!isLoading && articles?.length > 0 && (
            <div className="bg-dark p-3">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="border border-white text-white rounded m-2 p-2"
                >
                  <span className="line-right line-right-white">
                    <i className="bi bi-hand-thumbs-up"></i>
                    {" " +
                      article.likes.length +
                      (article.likes.length > 1 ? " likes" : " like")}
                  </span>
                  <Link
                    className="text-white link-underline link-underline-opacity-0"
                    to={"/article/" + article._id}
                  >
                    <h5>{article.title}</h5>
                  </Link>
                </div>
              ))}
            </div>
          )}
          {!isLoading && articles?.length === 0 && "No articles to display"}
        </div>
      </section>
    </div>
  );
};
