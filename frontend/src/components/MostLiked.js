import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetMostLiked } from "../Hooks/LikeHooks/UserGetMostLiked";
import classNames from "classnames";
import { LoadingRing } from "./LoadingRing";
import links from "../Utils/Links";

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
    <div className="container mt-5">
      <section className="row g-3">
        <div className="col col-12 text-center">
          <div className=" d-flex justify-content-center">
            <div
              className={classNames({
                "bg-secondary text-white p-2 me-3 pointer": true,
                active: time === "week",
              })}
              onClick={() => {
                setTime("week");
              }}
            >
              Most Liked This Week
            </div>
            <div
              className={classNames({
                "bg-secondary text-white p-2 me-3 pointer": true,
                active: time === "month",
              })}
              onClick={() => {
                setTime("month");
              }}
            >
              Most Liked This Month
            </div>
            <div
              className={classNames({
                "bg-secondary text-white p-2 pointer": true,
                active: time === "year",
              })}
              onClick={() => {
                setTime("year");
              }}
            >
              Most Liked This Year
            </div>
          </div>
        </div>
        <div className="col col-12">
          {isLoading && (
            <div className="container mt-5">
              <LoadingRing />
            </div>
          )}
          {!isLoading && articles?.length > 0 && (
            <div>
              {articles.map((article) => (
                <div className="bg-primary rounded m-2 p-3" key={article._id}>
                  <span className="line-right">
                    <i className="bi bi-hand-thumbs-up h5"></i>
                    {" " +
                      article.likes.length +
                      (article.likes.length > 1 ? " likes" : " like")}
                  </span>
                  {article.tags.map((tag, i) => {
                    return (
                      <Link
                        to={links.tag(tag)}
                        key={i}
                        className="me-1 unstyled-link"
                      >
                        #{tag}
                      </Link>
                    );
                  })}
                  <Link
                    className="unstyled-link"
                    to={"/article/" + article._id}
                  >
                    <h5 className="my-2">{article.title}</h5>
                  </Link>
                </div>
              ))}
            </div>
          )}
          {!isLoading && articles?.length === 0 && (
            <h2 className="text-center mt-3 text-info d-flex flex-column justify-content-center">
              <b>
                No articles to display at the moment. Consider sharing your own
                – who knows, they might become among the most liked!
              </b>

              <Link to={links.createAnArticle}>
                <button className="btn btn-primary btn-lg mt-3">
                  Create one here
                </button>
              </Link>
            </h2>
          )}
        </div>
      </section>
    </div>
  );
};
