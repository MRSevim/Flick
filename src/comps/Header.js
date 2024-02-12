import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useUserContext } from "./Contexts/UserContext";
import { useLogout } from "./Hooks/UseLogout";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export const Header = () => {
  const [user] = useUserContext();
  const [userMenu, setUserMenu] = useState(false);
  const { logout, error, setError } = useLogout();
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setUserMenu(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const logOut = async () => {
    await logout();

    setUserMenu(false);
  };

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
          {user ? (
            <div ref={wrapperRef} className="position-relative">
              <div
                onClick={() => {
                  setUserMenu((prev) => !prev);
                }}
                className="border border-light p-2 rounded-3 pointer user-container d-flex align-items-center justify-content-between "
              >
                <p className="m-0 me-3 overflow-hidden">
                  Hello {user.username}
                </p>
                <i
                  className={
                    userMenu
                      ? "fa-solid fa-chevron-down user-menu-toggler open"
                      : "fa-solid fa-chevron-down user-menu-toggler"
                  }
                ></i>
              </div>
              {userMenu && (
                <div className="user-options border border-light rounded-2 position-absolute bg-dark w-100 p-2">
                  <p className="m-0">
                    <Link
                      to="/my-profile"
                      className="text-white link-underline link-underline-opacity-0"
                      onClick={() => {
                        setUserMenu(false);
                      }}
                    >
                      My Profile
                    </Link>
                  </p>
                  <p className="m-0">
                    <Link
                      to="/my-articles"
                      className="text-white link-underline link-underline-opacity-0"
                      onClick={() => {
                        setUserMenu(false);
                      }}
                    >
                      My Articles
                    </Link>
                  </p>
                  <p className="m-0">
                    <span className="pointer" onClick={logOut}>
                      Logout
                    </span>
                  </p>
                </div>
              )}
            </div>
          ) : user === undefined ? (
            <div className="text-end user-container">
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
          ) : (
            <div className="text-end user-container"></div>
          )}
        </div>
      </div>
      {error && (
        <Alert
          className="position-absolute start-50 translate-middle"
          severity="error"
          onClose={() => {
            setError(false);
          }}
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
    </header>
  );
};
