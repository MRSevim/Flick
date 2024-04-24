import React, { useEffect, useState } from "react";
import { useGetSimilar } from "../../Hooks/ArticleHooks/UseGetSimilar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ImageComponent } from "../ImageComponent";
import links from "../../Utils/Links.js";
import { LoadingRing } from "../LoadingRing";
import { ArticleCardBody } from "./ArticleCardBody.js";

export const SimilarArticles = ({ id }) => {
  const [articles, setArticles] = useState([]);
  const { getSimilar, isLoading } = useGetSimilar();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 992 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 992, min: 576 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 576, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    const get = async () => {
      const { response, json } = await getSimilar(id);
      if (response.ok) {
        setArticles(json);
      }
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (isLoading) {
    return <LoadingRing />;
  }
  return (
    <>
      <h2>Similar Articles</h2>
      <Carousel responsive={responsive}>
        {articles.map((article) => {
          return (
            <div key={article._id} className="card article-card m-2">
              <ImageComponent src={article.image} />
              <ArticleCardBody
                classes={"me-2"}
                article={article}
                link={links.article(article._id)}
              />
            </div>
          );
        })}
      </Carousel>
    </>
  );
};
