"use client";
import Link from "next/link";
import classNames from "classnames";
import NextImage from "next/image";
import links from "@/utils/Links";
import { LikeButton } from "../LikeButton";
import { addDarkBg, extractExcerptFromHTML } from "@/utils/HelperFuncs";
import { Image } from "../Image";
import { useDarkModeContext } from "@/contexts/DarkModeContext";

export const MostLiked = ({ json, time }) => {
  const [darkMode] = useDarkModeContext();
  const articles = json;

  return (
    <div className="container">
      <section className="row g-3 pb-3">
        <div className="col col-12 text-center">
          <div className=" d-flex justify-content-center">
            <Link
              className={classNames({
                "bg-secondary text-white p-2 me-3 pointer": true,
                active: time === "week",
              })}
              href={links.mostLiked("week")}
            >
              Most Liked This Week
            </Link>
            <Link
              className={classNames({
                "bg-secondary text-white p-2 me-3 pointer": true,
                active: time === "month",
              })}
              href={links.mostLiked("month")}
            >
              Most Liked This Month
            </Link>
            <Link
              className={classNames({
                "bg-secondary text-white p-2 pointer": true,
                active: time === "year",
              })}
              href={links.mostLiked("year")}
            >
              Most Liked This Year
            </Link>
          </div>
        </div>
        <div className="col col-12">
          {articles.length > 0 && (
            <>
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
                            href={links.tag(tag)}
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
                      <Image src={article.image} classes="w-100 h-100" />
                    </div>
                    <div className="col col-12 col-lg-8 mb-3">
                      <Link
                        className="unstyled-link hovered-link"
                        href={"/article/" + article._id}
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
                        href={"/article/" + article._id}
                      >
                        Read More...
                      </Link>
                      <Link
                        className="bg-secondary rounded text-white p-2 unstyled-link hovered-link d-flex align-items-center m-2 position-absolute bottom-0 end-0"
                        href={links.publicUser(article.user._id)}
                      >
                        <Image
                          src={article.user.image}
                          classes={"profile-img-mini me-2"}
                        />

                        <p className="mb-1">{article.user.username}</p>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          {articles?.length === 0 && (
            <div className="text-center mt-3 row pb-4">
              <NextImage
                className="col col-12 col-lg-6 rounded-pill mb-4 h-100"
                src="/images/empty-most-liked.jpg"
                alt="no most liked articles"
                sizes="100%"
                width={0}
                height={0}
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
                <Link href={links.createAnArticle}>
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
