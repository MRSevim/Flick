import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchAll } from "@/hooks/SearchHooks/UseSearchAll";
import Autocomplete from "@mui/material/Autocomplete";
import links from "@/utils/Links";
import { Image } from "@/components/Image";

export const SearchBar = () => {
  const router = useRouter();
  const [searchParam, setSearchParam] = useState("");
  const { searchAll, isLoading } = useSearchAll();
  const [options, setOptions] = useState({ users: [], articles: [] });

  const search = (e) => {
    e.preventDefault();
    if (searchParam.trim()) {
      router.push(links.search(searchParam.trim()));
    }
  };

  useEffect(() => {
    const get = async () => {
      const json = await searchAll(searchParam);
      setOptions(json);
    };

    if (searchParam.trim()) {
      get();
    }
  }, [searchParam]);

  const handleInputChange = (event, newInputValue) => {
    setSearchParam(newInputValue);
    if (!newInputValue.trim()) {
      setOptions({ users: [], articles: [] });
    }
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
          <div {...props} key={option._id}>
            <Link
              className="d-flex align-items-center"
              href={
                option.username
                  ? links.publicUser(option._id)
                  : links.article(option._id)
              }
            >
              {option.username && (
                <Image src={option.image} classes={"profile-img-mini me-2"} />
              )}
              <p className="mb-1">{ownerState.getOptionLabel(option)}</p>
            </Link>
          </div>
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
              className="form-control"
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
