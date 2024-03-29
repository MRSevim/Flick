import React from "react";
import { Link } from "react-router-dom";

export const FollowButtons = ({ followerNumber, followingNumber, id }) => {
  return (
    <div>
      <Link to={"/followers/" + id}>
        <button className="btn btn-dark me-3">
          Followers({followerNumber})
        </button>
      </Link>
      <Link to={"/followings/" + id}>
        <button className="btn btn-info">Following({followingNumber})</button>
      </Link>
    </div>
  );
};
