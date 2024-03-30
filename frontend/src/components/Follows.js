import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetFollows } from "../Hooks/FollowHooks/UseGetFollows";

export const Follows = ({ type }) => {
  const [users, setUsers] = useState(null);
  const { id } = useParams();
  const { getFollows, isLoading } = useGetFollows();
  useEffect(() => {
    const get = async () => {
      const { response, json } = await getFollows(id, type);
      if (response.ok) {
        if (type === "followers") {
          setUsers(json.followers);
        }
        if (type === "followings") {
          setUsers(json.followings);
        }
      }
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="container mt-3">
      {isLoading ? (
        <div className=" d-flex justify-content-center">
          <div className="lds-ring">
            <div></div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center">
          <h2>{capitalizeFirstLetter(type)}</h2>
          {users?.length ? (
            <div className="mb-4 row g-3 w-100">
              {users.map((user) => (
                <div key={user._id} className="col col-12 col-md-6 col-lg-4">
                  <div className="card">
                    <div className="card-body">
                      <img
                        src={user.image}
                        alt="profile-img-mini"
                        className="profile-img-mini me-2"
                      />
                      <Link
                        className="unstyled-link"
                        to={"/user/" + user.username}
                      >
                        <h5 className="card-title m-0 search-card-text">
                          {user.username}
                        </h5>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
