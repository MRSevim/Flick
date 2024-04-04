import React from "react";
import { Link } from "react-router-dom";
import links from "../Utils/Links";

export const Home = () => {
  return (
    <div className="pb-5">
      <div className="bg-primary bg-opacity-75">
        <div className="container mt-5 py-5">
          <div className="row text-info align-items-center">
            <div className="col col-12 col-lg-6 hero-image">
              <div className="d-flex justify-content-center align-items-center h-100">
                <Link to={links.createAnArticle}>
                  <button className="btn btn-secondary btn-xl ms-3">
                    Start Your Journey
                  </button>
                </Link>
              </div>
            </div>
            <div className="col col-12 col-lg-6 d-flex flex-column justify-content-center text-center ">
              <h2 className="mb-4 fw-bold hero-3d">Find meaning in writing</h2>
              <h3>A Website to consume and produce written content...</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="accordion" id="accordionFlick">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <h2>What can I do in this website?</h2>
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              data-bs-parent="#accordionFlick"
            >
              <div className="accordion-body">
                You can create, edit and delete articles, like articles, follow
                each other, comment on articles, get notified on actions, see
                most liked articles. More features might be added depending on
                the need.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                <h2>Why should I use this website?</h2>
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlick"
            >
              <div className="accordion-body">
                Why question can be thought provoking question. Why should one
                do anything? It seems like answer to that can change from person
                to person. But If you are interested in written communication
                and sharing ideas in that manner, you might find meaning using
                this website.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                <h2>Why do you display most liked articles?</h2>
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlick"
            >
              <div className="accordion-body">
                I chose to include most liked articles in my website structure
                because I thought it can give some form of rating that people
                can use in their decision making when choosing articles to read.
                Choosing which articles to read and engage with can be be
                challenging and average opinion can be a metric in that matter.
                It is like Imdb rating. It can help you choose a movie but It
                might not necessarily guarantee that you will like the movie. It
                is a useful tool.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
