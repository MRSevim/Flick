import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchAll } from "../Hooks/SearchHooks/UseSearchAll";
import Autocomplete from "@mui/material/Autocomplete";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParam, setSearchParam] = useState("");
  const { searchAll, isLoading } = useSearchAll();
  const [options, setOptions] = useState({ users: [], articles: [] });

  const search = (e) => {
    e.preventDefault();
    if (searchParam.trim()) {
      navigate("/search?q=" + searchParam.trim());
    }
  };

  useEffect(() => {
    const get = async () => {
      const json = await searchAll(searchParam);
      setOptions(json);
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam]);

  const handleInputChange = (event, newInputValue) => {
    setSearchParam(newInputValue);
  };

  return (
    <form className="col-12 col-lg-4 mb-3 mb-lg-0 me-lg-3" onSubmit={search}>
      <Autocomplete
        freeSolo
        options={isLoading ? [] : [...options.users, ...options.articles]}
        groupBy={(option) => (option.username ? "Users" : "Articles")}
        inputValue={searchParam}
        getOptionLabel={(option) =>
          option.username || option.title
            ? option.username || option.title
            : option
        }
        renderOption={(props, option, state, ownerState) => (
          <Link
            to={
              option.username ? "/user/" + option._id : "/article/" + option._id
            }
            {...props}
            key={option._id}
          >
            {option.username && (
              <img
                src={option.image}
                alt="profile-img-mini"
                className="profile-img-mini me-2"
                referrerPolicy="no-referrer"
              />
            )}
            <p className="mb-1">{ownerState.getOptionLabel(option)}</p>
          </Link>
        )}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <input
              {...params.inputProps}
              type="search"
              className="form-control form-control-dark"
              placeholder="Search..."
              aria-label="Search"
            ></input>
          </div>
        )}
      />
    </form>
  );
};
