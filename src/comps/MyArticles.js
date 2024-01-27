import React from "react";
import { Link } from "react-router-dom";

export const MyArticles = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">My Articles</h1>
      <Link to="/articles/1" className="text-black">
        Check the default article
      </Link>
    </div>
  );
};
