import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalErrorContext } from "./Contexts/GlobalErrorContext";

export const Articles = () => {
  const [articles, setArticles] = useState(null);
  const [user, setUser] = useState(null);
  const [, setGlobalError] = useGlobalErrorContext();

  useEffect(() => {});
  return (
    <div className="container mt-5">
      <h1 className="text-center">{user}'s Articles</h1>
      <Link to="/articles/1" className="text-black">
        Check the default article
      </Link>
    </div>
  );
};
