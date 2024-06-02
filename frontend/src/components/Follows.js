import React, { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useGetFollows } from "../Hooks/FollowHooks/UseGetFollows";
import { LoadingRing } from "./LoadingRing";
import links from "../Utils/Links";
import { ImageComponent } from "./ImageComponent";
import { addDarkBg } from "../Utils/HelperFuncs";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { Pagination } from "@mui/material";
import { capitalizeFirstLetter } from "../Utils/HelperFuncs";

export const Follows = ({ type }) => {
  const [users, setUsers] = useState(null);
  const [darkMode] = useDarkModeContext();
  const { id } = useParams();
  const { getFollows, isLoading } = useGetFollows();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    const get = async () => {
      const { response, json } = await getFollows(id, type, page);
      if (response.ok) {
        setUsers(json[type]);
        setTotalPages(json.totalPages);
      }
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type, page]);

  const handlePaginationChange = (event, value) => {
    searchParams.set("page", value);
    setSearchParams(searchParams);
  };

  return (
    <div className="container mt-3">
      {isLoading ? (
        <LoadingRing />
      ) : (
        <div className="d-flex flex-column align-items-center">
          <h2>{capitalizeFirstLetter(type)}</h2>

          {users?.length ? (
            <>
              <div className="d-flex justify-content-center mb-3">
                <Pagination
                  page={Number(page)}
                  showFirstButton
                  showLastButton
                  count={totalPages}
                  shape="rounded"
                  onChange={handlePaginationChange}
                />
              </div>
              <div className="mb-4 row g-3 w-100">
                {users.map((user) => (
                  <div key={user._id} className="col col-12 col-md-6 col-lg-4">
                    <div className={"card " + addDarkBg(darkMode)}>
                      <div className="card-body d-flex align-items-center">
                        <ImageComponent
                          src={user.image}
                          classes={"profile-img-mini me-2"}
                        />
                        <Link
                          className="unstyled-link"
                          to={links.publicUser(user._id)}
                        >
                          <span className="card-title m-0 search-card-text h5">
                            {user.username}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <h2 className="mb-4">
              {" "}
              <i className="bi bi-emoji-frown h1 me-2"></i>No users to display
            </h2>
          )}
        </div>
      )}
    </div>
  );
};
