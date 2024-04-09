import React from "react";
import { Link } from "react-router-dom";
import links from "../Utils/Links";

export const UserMenu = ({ setUserMenu, logOut, myId, user }) => {
  return (
    <div className="user-menu-container border border-light text-info rounded-2 position-absolute bg-primary p-2">
      <div>
        <p className="pb-2 border-bottom text-center text-break">
          {user.username}
        </p>
        <Link
          to={links.myProfile}
          className="unstyled-link"
          onClick={() => {
            setUserMenu(false);
          }}
        >
          My Profile
        </Link>
      </div>
      <p className="m-0">
        <Link
          to={links.allArticles(myId)}
          className="unstyled-link"
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
  );
};