import { Image } from "@/components/Image.js";
import links from "@/utils/Links";
import { ArticleCardBody } from "../ArticleCardBody.js";
import { useDarkModeContext } from "@/contexts/DarkModeContext.js";
import { addDarkBg } from "@/utils/HelperFuncs.js";
import { Popup } from "../Popup.js";
import { LikeButton } from "../LikeButton.js";
import { Slider } from "../Slider.js";

export const SimilarArticles = ({ similar, error }) => {
  const articles = similar;
  const [darkMode] = useDarkModeContext();

  if (error) {
    return <Popup message={error} type="danger" />;
  }

  if (articles.length) {
    return (
      <>
        <h2>Similar Articles</h2>
        <Slider itemLength={articles.length}>
          {articles.map((article) => {
            return (
              <div key={article._id} className="p-2 col-12 col-lg-6">
                <div
                  className={"card w-100 article-card " + addDarkBg(darkMode)}
                >
                  <div className="m-2 image-wrapper">
                    <Image classes="featured-image-mini" src={article.image} />
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
      </>
    );
  }
};
