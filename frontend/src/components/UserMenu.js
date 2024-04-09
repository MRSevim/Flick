import React from "react";
import { Link } from "react-router-dom";
import links from "../Utils/Links";

export const UserMenu = ({ setUserMenu, logOut, myId, user }) => {
  return (
    <div className="user-menu-container rounded border bg-light rounded-2 position-absolute bg-primary">
      <div>
        <p className="p-2 m-0 border-bottom text-center text-break">
          {user.username}
        </p>
        <Link
          to={links.myProfile}
          className="unstyled-link"
          onClick={() => {
            setUserMenu(false);
          }}
        >
          <p className="m-0 p-2 text-center usermenu-link">My Profile</p>
        </Link>
      </div>
      <Link
        to={links.allArticles(myId)}
        className="unstyled-link"
        onClick={() => {
          setUserMenu(false);
        }}
      >
        <p className="m-0 p-2 text-center usermenu-link">My Articles</p>
      </Link>
      <p className="m-0 p-2 text-center usermenu-link pointer" onClick={logOut}>
        Logout
      </p>
    </div>
  );
};
