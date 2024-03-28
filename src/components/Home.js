import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="pb-4">
      <div className="bg-primary">
        <div className="container mt-5 py-4">
          <div className="row text-info align-items-center">
            <div className="col col-12 col-lg-6 hero-image">
              <div className="d-flex justify-content-center align-items-center h-100">
                <Link to={"/create-an-article"}>
                  <button className="btn btn-secondary btn-xl ms-3">
                    Start Your Journey
                  </button>
                </Link>
              </div>
            </div>
            <div className="col col-12 col-lg-6 d-flex justify-content-center h5">
              <ul className="lh-base list-unstyled">
                <li>Create, edit and delete articles</li>
                <li>Like articles</li>
                <li>Follow each other</li>
                <li>Comment on articles</li>
                <li>Get notified on actions</li>
                <li>See most liked articles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
