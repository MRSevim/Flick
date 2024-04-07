import React, { useEffect, useState } from "react";
import { TagsForm } from "./TagsForm";
import { useSearchAdvanced } from "../Hooks/SearchHooks/UseSearchAdvanced";

export const AdvancedSearch = ({
  className,
  page,
  _username,
  setArticles,
  searchParams,
  setSearchParams,
  setUsers,
  passLoading,
}) => {
  const [username, setUsername] = useState(_username || "");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const advancedSearchString = searchParams.get("advancedSearch");
  const advancedSearch = advancedSearchString === "true";
  const usernameParam = searchParams.get("username");
  const titleParam = searchParams.get("title");
  const tagsParam = searchParams.get("tags");
  const { searchAdvanced, isLoading } = useSearchAdvanced();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({
      advancedSearch: "true",
      page: page || "",
      username,
      title,
      tags: tags.join(","),
    });
  };
  useEffect(() => {
    if (usernameParam) {
      setUsername(usernameParam);
    }
    if (titleParam) {
      setTitle(titleParam);
    }
    if (tagsParam) {
      setTags(tagsParam.split(","));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const clearFilters = () => {
    setUsername(_username || "");
    setTitle("");
    setTags([]);
  };
  useEffect(() => {
    if (passLoading) {
      passLoading(isLoading);
    }
  }, [passLoading, isLoading]);

  useEffect(() => {
    const get = async () => {
      const { response, json } = await searchAdvanced(
        usernameParam,
        titleParam,
        tagsParam
      );
      if (response.ok && setArticles && setUsers) {
        setArticles(json.articles);
        setUsers(json.users);
      }
    };
    if (advancedSearch) {
      get();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    advancedSearch,
    setArticles,
    setUsers,
    usernameParam,
    titleParam,
    tagsParam,
  ]);

  return (
    <div className={"shadow-lg rounded p-4 mb-3 " + className}>
      <h2>Advanced Search {_username && "by User"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="form-group col col-12 col-lg-6 mb-2">
            <label className="w-100">
              Username:
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className="form-control"
                type="text"
              />
            </label>
          </div>
          <div className="form-group col col-12 col-lg-6">
            <label className="w-100">
              Article Title:
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className="form-control"
                type="text"
              />
            </label>
          </div>
        </div>
        <div className="form-group mb-3">
          <TagsForm
            classes={""}
            tags={tags}
            onTagsChange={(newTags) => {
              setTags(newTags);
            }}
          />
        </div>
        <input
          disabled={isLoading}
          className="btn btn-secondary"
          type="submit"
          value="Advanced Search"
        />
        <button
          type="button"
          disabled={isLoading}
          className="btn btn-info ms-2"
          onClick={clearFilters}
        >
          {" "}
          Clear Filters
        </button>
      </form>
    </div>
  );
};
