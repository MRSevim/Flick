import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useGetMostLiked } from "../Hooks/LikeHooks/UserGetMostLiked";
import classNames from "classnames";
import { LoadingRing } from "./LoadingRing";
import links from "../Utils/Links";
import empty from "../Utils/images/empty-most-liked.jpg";
import { LikeButton } from "./Articles/LikeButton";
import { addDarkBg, extractExcerptFromHTML } from "../Utils/HelperFuncs";
import { ImageComponent } from "./ImageComponent";
import { useDarkModeContext } from "../Contexts/DarkModeContext";

export const MostLiked = () => {
  const { getMostLiked, isLoading } = useGetMostLiked();
  const [articles, setArticles] = useState(null);
  const [darkMode] = useDarkModeContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const time = searchParams.get("time");

  useEffect(() => {
    const get = async (time) => {
      const { json } = await getMostLiked(time);
      setArticles(json);
    };

    get(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, setArticles]);

  return (
    <div className="container">
      <section className="row g-3 pb-3">
        <div className="col col-12 text-center">
          <div className=" d-flex justify-content-center">
            <div
              className={classNames({
                "bg-secondary text-white p-2 me-3 pointer": true,
                active: time === "week",
              })}
              onClick={() => {
                setSearchParams({
                  time: "week",
                });
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
                setSearchParams({
                  time: "month",
                });
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
                setSearchParams({
                  time: "year",
                });
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
                <div
                  className={
                    "bg-primary position-relative rounded m-2 p-3 " +
                    addDarkBg(darkMode)
                  }
                  key={article._id}
                >
                  <div className="d-flex justify-content-between">
                    <LikeButton classes={"me-3"} article={article} />
                    <div>
                      {article.tags.map((tag, i) => {
                        return (
                          <Link
                            to={links.tag(tag)}
                            key={i}
                            className="me-2 unstyled-link text-white hovered-link"
                          >
                            #{tag}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col col-12 col-lg-4 image-wrapper">
                      <ImageComponent
                        src={article.image}
                        classes="mw-100 h-100"
                      />
                    </div>
                    <div className="col col-12 col-lg-8 mb-3">
                      <Link
                        className="unstyled-link hovered-link"
                        to={"/article/" + article._id}
                      >
                        <h5 className="my-2">{article.title}</h5>
                      </Link>
                      <p
                        className="article-card-inner-html"
                        dangerouslySetInnerHTML={{
                          __html: extractExcerptFromHTML(
                            article.content.trim()
                          ),
                        }}
                      ></p>

                      <Link
                        className="unstyled-link hovered-link"
                        to={"/article/" + article._id}
                      >
                        Read More...
                      </Link>
                      <Link
                        className="bg-secondary rounded text-white p-2 unstyled-link hovered-link d-flex align-items-center m-2 position-absolute bottom-0 end-0"
                        to={links.publicUser(article.user._id)}
                      >
                        <ImageComponent
                          src={article.user.image}
                          classes={"profile-img-mini me-2"}
                        />

                        <p className="mb-1">{article.user.username}</p>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!isLoading && articles?.length === 0 && (
            <div className="text-center mt-3 row pb-4">
              <img
                className="col col-12 col-lg-6 rounded-pill mb-4"
                src={empty}
                alt=""
              />
              <div className="col col-12 col-lg-6 d-flex flex-column justify-content-center">
                <h2 className="fw-bold mb-2">
                  {" "}
                  No articles to display at the moment.
                </h2>
                <h5 className="">
                  Consider sharing your own – who knows, they might become among
                  the most liked!
                </h5>
                <Link to={links.createAnArticle}>
                  <button className="btn btn-secondary font-secondary btn-lg mt-3">
                    Create one here
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
