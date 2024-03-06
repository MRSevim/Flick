import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParam, setSearchParam] = useState("");

  const search = (e) => {
    e.preventDefault();
    if (searchParam.trim()) {
      navigate("/search?q=" + searchParam.trim());
    }
  };

  return (
    <form className="col-12 col-lg-4 mb-3 mb-lg-0 me-lg-3" onSubmit={search}>
      <input
        value={searchParam}
        onChange={(e) => {
          setSearchParam(e.target.value);
        }}
        type="search"
        className="form-control form-control-dark"
        placeholder="Search..."
        aria-label="Search"
      ></input>
    </form>
  );
};
