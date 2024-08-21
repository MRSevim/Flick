"use client";
import links from "@/utils/Links";
import { ArticleCardBody } from "../ArticleCardBody";
import { LikeButton } from "../LikeButton";
import { Slider } from "../Slider";
import { addDarkBg } from "@/utils/HelperFuncs";
import { Popup } from "../Popup";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { Image } from "../Image";

export const Featured = ({ json, error }) => {
  const articles = json;
  const [darkMode] = useDarkModeContext();

  if (error) {
    return <Popup message={error} type="danger" />;
  }

  if (articles.length) {
    return (
      <div className="mt-3">
        <h2 className="d-flex justify-content-center">Featured Articles</h2>
        <Slider itemLength={articles.length}>
          {articles.map((article) => {
            return (
              <div key={article._id} className="p-2 col-12 col-lg-6">
                <div
                  className={"card w-100 article-card " + addDarkBg(darkMode)}
                >
                  <div className="my-2 image-wrapper">
                    <Image
                      classes={"w-auto h-100 mw-100 mh-100"}
                      src={article.image}
                    />
                  </div>
                  <ArticleCardBody
                    classes={"mt-2 mb-5"}
                    article={article}
                    link={links.article(article._id)}
                  >
                    <LikeButton
                      classes="p-1 m-1 mb-3 position-absolute bottom-0 start-0"
                      article={article}
                    />
                  </ArticleCardBody>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    );
  }
};
