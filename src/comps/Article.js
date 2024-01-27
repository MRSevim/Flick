import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArticleSections } from "./ArticleSections";

export const Article = () => {
  const { id } = useParams();
  const ref = useRef(null);
  const [sections, setSections] = useState(null);

  useEffect(() => {
    let headers = [];
    let initialId = 0;
    ref.current
      .querySelectorAll("h1, h2, h3, h4, h5, h6")
      .forEach((element) => {
        element.id = initialId++;
        headers.push(element);
      });

    setTimeout(() => {
      setSections(headers);
    }, 250);
  }, [id, setSections]);
  return (
    <div className="container mt-3 ">
      <div className="row justify-content-center">
        <div className="col col-12 col-lg-2">
          <h3 className="">Sections</h3>
          {!sections && (
            <div className="d-flex justify-content-center article-headers">
              <div className="lds-ring ">
                <div></div>
              </div>
            </div>
          )}
          {sections && <ArticleSections sections={sections} />}
        </div>
        <div className="article col">
          <h1 className="display-4">Article {id}</h1>
          <article ref={ref} className="article-body">
            <h3>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
              sapiente!
            </h3>

            <h4>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
              sapiente!
            </h4>
            <h2>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
              sapiente!
            </h2>
            <h5>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perspiciatis distinctio, voluptatem reprehenderit iure sit quis .
            </h5>
            <h4>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perspiciatis distinctio, voluptatem reprehenderit iure sit quis .
            </h4>
            <h3>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem, culpa?
            </h3>
            <h4>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem, culpa?
            </h4>
            <h3>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem, culpa?
            </h3>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Voluptate corrupti, suscipit quidem amet sapiente beatae, optio
              cumque illum aliquid, incidunt nobis praesentium facilis doloribus
              sint cupiditate ea. Cumque, ad dolores.
            </p>
            <h1>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum,
              in?
            </h1>
            <h2>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
              labore.
            </h2>
            <h3>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem, culpa?
            </h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              totam eligendi magni voluptatem quisquam magnam. Quos, commodi!
              Vero reiciendis incidunt veritatis officia quod minus, porro nemo
              sed voluptas aut beatae ipsam dolorum, necessitatibus ipsa
              tempora, consectetur voluptatum ex? Neque libero laborum possimus
              ipsum. Laudantium veniam corporis voluptatum. Ut, reprehenderit
              alias.
            </p>
            <h6>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum,
              in?
            </h6>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              totam eligendi magni voluptatem quisquam magnam. Quos, commodi!
              Vero reiciendis incidunt veritatis officia quod minus, porro nemo
              sed voluptas aut beatae ipsam dolorum, necessitatibus ipsa
              tempora, consectetur voluptatum ex? Neque libero laborum possimus
              ipsum. Laudantium veniam corporis voluptatum. Ut, reprehenderit
              alias.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              totam eligendi magni voluptatem quisquam magnam. Quos, commodi!
              Vero reiciendis incidunt veritatis officia quod minus, porro nemo
              sed voluptas aut beatae ipsam dolorum, necessitatibus ipsa
              tempora, consectetur voluptatum ex? Neque libero laborum possimus
              ipsum. Laudantium veniam corporis voluptatum. Ut, reprehenderit
              alias.
            </p>
          </article>
        </div>
        <div className="col col-12 col-lg-2 border border-dark">
          <h3 className="">Extra</h3>
        </div>
      </div>
    </div>
  );
};
