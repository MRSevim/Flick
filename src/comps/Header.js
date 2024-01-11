import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="text-bg-dark p-3">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <h1 className="d-flex align-items-center pe-lg-3 mb-2 mb-lg-0 ">
            Flick
          </h1>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li className="nav-item">
              <Link to="/" className="nav-link px-2 text-white">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/most-liked" className="nav-link px-2 text-white">
                Most liked
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/create-an-article"
                className="nav-link px-2 text-white"
              >
                Create an Article
              </Link>
            </li>
          </ul>
          <form className="col-12 col-lg-4 mb-3 mb-lg-0 me-lg-3">
            <input
              type="search"
              className="form-control form-control-dark "
              placeholder="Search..."
              aria-label="Search"
            ></input>
          </form>
          <div className="text-end ">
            <Link to="/login">
              <button type="button" className="btn btn-outline-light me-2">
                Login
              </button>
            </Link>
            <Link to="/sign-up">
              <button type="button" className="btn btn-warning">
                Sign-up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
