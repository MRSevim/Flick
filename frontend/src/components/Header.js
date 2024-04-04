import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import classNames from "classnames";
import { useUserContext } from "../Contexts/UserContext";
import { useLogout } from "../Hooks/UserHooks/UseLogout";
import { SearchBar } from "./SearchBar";
import { Notifications } from "./Notifications";
import { UserMenu } from "./UserMenu";
import links from "../Utils/Links";
import { ImageComponent } from "./ImageComponent";

export const Header = () => {
  const [user] = useUserContext();
  const location = useLocation();
  const [userMenu, setUserMenu] = useState(false);
  const [myId, setMyId] = useState("");
  const { logout } = useLogout();
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (user) {
      setMyId(user._id);
    }
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
  }, [wrapperRef, user]);

  const logOut = async () => {
    await logout();

    setUserMenu(false);
  };

  const setActiveClassNames = (type) => {
    return classNames({
      "nav-link px-2 text-info": true,
      active: location.pathname === type,
    });
  };

  return (
    <>
      <header className="bg-primary text-info p-3">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <h1 className="d-flex align-items-center pe-lg-3 mb-2 mb-lg-0">
              <b>Flick</b>
            </h1>
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li className="nav-item">
                <Link to={links.homepage} className={setActiveClassNames("/")}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={links.mostLiked}
                  className={setActiveClassNames("/most-liked")}
                >
                  Most liked
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={links.createAnArticle}
                  className={setActiveClassNames("/create-an-article")}
                >
                  Create an Article
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={links.about}
                  className={setActiveClassNames("/about")}
                >
                  About
                </Link>
              </li>
            </ul>
            <SearchBar />
            {user && <Notifications />}
            {user ? (
              <div ref={wrapperRef} className="position-relative">
                <div
                  onClick={() => {
                    setUserMenu((prev) => !prev);
                  }}
                  className="text-end pointer"
                >
                  <ImageComponent src={user.image} type={"mini"} />
                </div>
                {userMenu && (
                  <UserMenu
                    setUserMenu={setUserMenu}
                    logOut={logOut}
                    myId={myId}
                    user={user}
                  />
                )}
              </div>
            ) : user === undefined ? (
              <div className="text-end user-container">
                <Link to={links.login}>
                  <button type="button" className="btn btn-outline-light me-2">
                    Login
                  </button>
                </Link>
                <Link to={links.signup}>
                  <button type="button" className="btn btn-secondary">
                    Sign-up
                  </button>
                </Link>
              </div>
            ) : (
              <div className="text-end user-container"></div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
