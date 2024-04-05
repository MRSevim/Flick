import React from "react";

export const AdvancedSearch = ({ setArticles, setSearchParams, setUsers }) => {
  const setParam = () => {
    setSearchParams({ q: "" });
  };

  return <button onClick={setParam}>setparam</button>;
};
