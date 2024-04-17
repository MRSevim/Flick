import React, { useEffect, useState } from "react";
import { useGetSimilar } from "../../Hooks/ArticleHooks/UseGetSimilar";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ImageComponent } from "../ImageComponent";
import links from "../../Utils/Links.js";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export const SimilarArticles = ({ id }) => {
  const [articles, setArticles] = useState([]);
  const { getSimilar } = useGetSimilar();

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
  return (
    <>
      {" "}
      {articles.map((article) => {
        return (
          <div
            key={article._id}
            className="d-flex flex-column align-items-center"
          >
            <ImageComponent src={article.image} />
            <Link to={links.article(article._id)}>
              <h3>{article.title}</h3>
            </Link>
          </div>
        );
      })}{" "}
    </>
  );
};
