import React from "react";
import { Link } from "react-router-dom";
import links from "../Utils/Links";

export const FollowButtons = ({ followerNumber, followingNumber, id }) => {
  return (
    <>
      <Link to={links.followers(id)}>
        <button className="btn btn-secondary me-2">
          Followers({followerNumber})
        </button>
      </Link>
      <Link to={links.followings(id)}>
        <button className="btn btn-secondary">
          Following({followingNumber})
        </button>
      </Link>
    </>
  );
};
