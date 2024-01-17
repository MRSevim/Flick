import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="container mt-3">
      <h2>Check out some of the popular articles...</h2>
      <Link to="/articles/1" className="text-black">
        Go to article page
      </Link>
    </div>
  );
};
