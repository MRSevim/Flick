import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetPublicUser } from "./Hooks/UserHooks/UseGetPublicUser";
import { useFollowUser } from "./Hooks/FollowHooks/UseFollowUser";
import { useUserContext } from "./Contexts/UserContext";

export const User = () => {
  const { username } = useParams();
  const { getPublicUser, isLoading } = useGetPublicUser();
  const [globalUser] = useUserContext();
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(null);
  const [memberSince, setMemberSince] = useState(null);
  const [followerNumber, setFollowerNumber] = useState(null);
  const [followingNumber, setFollowingNumber] = useState(null);
  const { followUser, isLoading: followLoading } = useFollowUser();

  const handleFollow = async (id) => {
    const { response, json } = await followUser(id);
    if (response.ok) {
      setFollowerNumber(json.followerNumber);
      setFollowingNumber(json.followingNumber);
      setFollowing(!following);
    }
  };

  useEffect(() => {
    const get = async () => {
      const json = await getPublicUser(username);
      setFollowerNumber(json.followerNumber);
      setFollowingNumber(json.followingNumber);
      setUser(json);
      setFollowing(json?.followers?.includes(globalUser._id));
      const date = new Date(json.createdAt);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setMemberSince(formattedDate);
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, setUser]);

  return (
    <div className="container mt-3 h-100">
      {isLoading ? (
        <div className=" d-flex justify-content-center">
          <div className="lds-ring">
            <div></div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col col-12 col-lg-3">
            <div className="d-flex justify-content-center">
              <img
                src={user?.image}
                alt="profile-img-large"
                className="profile-img"
              />
            </div>
            <div className="text-center">
              <h1 className="fw-bold"> {user.username}</h1>
              <p className="mt-3">
                They have been a member of the website since{" "}
                <span className="fw-bold">{memberSince}</span>
              </p>
              <button type="button" className="btn btn-info">
                <Link
                  className="text-dark link-underline link-underline-opacity-0"
                  to={"/article/user/" + user._id + "/articles?page=1"}
                >
                  See all of their articles...
                </Link>
              </button>
            </div>
            {user._id !== globalUser._id && (
              <div className="text-center">
                <button
                  disabled={followLoading}
                  className="btn btn-warning mt-3"
                  onClick={() => {
                    handleFollow(user._id);
                  }}
                >
                  {following ? "Unfollow" : "Follow"}
                </button>
              </div>
            )}
            <div className="mt-4 d-flex justify-content-center">
              <button className="btn btn-dark me-3">
                Followers({followerNumber})
              </button>
              <button className="btn btn-info">
                Following({followingNumber})
              </button>
            </div>
          </div>
          <div className="col col-12 col-lg-9 d-flex flex-column mt-4 align-items-center">
            <h2>These are their most liked articles...</h2>
            <div className="my-2">
              {user?.mostLikedArticles?.length === 0 && (
                <h3>
                  <b>No articles to display :(</b>
                </h3>
              )}
              {user?.mostLikedArticles?.map((article) => (
                <li key={article._id}>
                  <span className="line-right">
                    <i className="bi bi-hand-thumbs-up"></i>
                    {" " +
                      article.likeCount +
                      (article.likeCount > 1 ? " likes" : " like")}{" "}
                  </span>
                  <span>
                    <Link
                      className="text-dark link-underline link-underline-opacity-0"
                      to={"/article/" + article._id}
                    >
                      {article.title}
                    </Link>
                  </span>
                </li>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
