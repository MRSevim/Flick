import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Image } from "@/components/Image.js";
import links from "@/utils/Links";
import { ArticleCardBody } from "../ArticleCardBody.js";
import { useDarkModeContext } from "@/contexts/DarkModeContext.js";
import { addDarkBg } from "@/utils/HelperFuncs.js";
import { Popup } from "../Popup.js";
import { LikeButton } from "../LikeButton.js";

export const SimilarArticles = ({ similar, error }) => {
  const articles = similar;
  const [darkMode] = useDarkModeContext();

  const responsive = {
    tablet: {
      breakpoint: { max: 3000, min: 576 },
      items: articles.length > 1 ? 2 : 1,
    },
    mobile: {
      breakpoint: { max: 576, min: 0 },
      items: 1,
    },
  };

  if (error) {
    return <Popup message={error} type="danger" />;
  }
  if (articles.length) {
    return (
      <>
        <h2>Similar Articles</h2>
        <Carousel responsive={responsive}>
          {articles.map((article) => {
            return (
              <div
                key={article._id}
                className={"card article-card h-100 m-2 " + addDarkBg(darkMode)}
              >
                <Image
                  classes={"p-2 w-auto h-auto mw-100 mh-100"}
                  src={article.image}
                />
                <ArticleCardBody
                  classes={"my-4"}
                  article={article}
                  link={links.article(article._id)}
                >
                  <LikeButton
                    classes="p-1 m-1 mb-3 position-absolute bottom-0 start-0"
                    article={article}
                  />
                </ArticleCardBody>
              </div>
            );
          })}
        </Carousel>
      </>
    );
  }
};
