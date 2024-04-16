import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchAll } from "../Hooks/SearchHooks/UseSearchAll";
import Autocomplete from "@mui/material/Autocomplete";
import links from "../Utils/Links";
import { ImageComponent } from "./ImageComponent";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParam, setSearchParam] = useState("");
  const { searchAll, isLoading } = useSearchAll();
  const [options, setOptions] = useState({ users: [], articles: [] });

  const search = (e) => {
    e.preventDefault();
    if (searchParam.trim()) {
      navigate(links.search(searchParam.trim()));
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
    <form className="col-12 col-lg-4 mb-3 mb-lg-0 me-lg-5" onSubmit={search}>
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
              option.username
                ? links.publicUser(option._id)
                : links.article(option._id)
            }
            {...props}
            key={option._id}
          >
            {option.username && (
              <ImageComponent
                src={option.image}
                classes={"profile-img-mini me-2"}
              />
            )}
            <p className="mb-1">{ownerState.getOptionLabel(option)}</p>
          </Link>
        )}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <div ref={params.InputProps.ref} className="d-flex">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  search(e);
                }
              }}
              {...params.inputProps}
              type="search"
              className="form-control form-control-dark"
              placeholder="Search..."
              aria-label="Search"
            ></input>
            <i
              className="bi bi-search h4 m-0 ms-2 d-flex align-items-center pointer"
              onClick={search}
            ></i>
          </div>
        )}
      />
    </form>
  );
};
