import { useState } from "react";
import { TagsForm } from "./TagsForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const AdvancedSearch = ({ className, page, _username }) => {
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get("username");
  const titleParam = searchParams.get("title");
  const tagsParam = searchParams.get("tags");
  let initialTags = [];
  if (tagsParam) {
    initialTags = tagsParam.split(",");
  }
  const [username, setUsername] = useState(_username || usernameParam || "");
  const [title, setTitle] = useState(titleParam || "");
  const [tags, setTags] = useState(initialTags);
  const pathname = usePathname();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    params.set("advancedSearch", "true");
    if (!username && !title && !tags.length) {
      params.set("advancedSearch", "false");
    }
    params.set("page", page || "");
    params.set("username", username);
    params.set("title", title);
    params.set("tags", tags.join(","));

    router.push(pathname + "?" + params.toString());
  };

  const clearFilters = () => {
    setUsername(_username || "");
    setTitle("");
    setTags([]);
  };

  return (
    <div className={"shadow border border-3 rounded p-4 mb-3 " + className}>
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
          className="btn btn-secondary"
          type="submit"
          value="Advanced Search"
        />
        <button
          type="button"
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
