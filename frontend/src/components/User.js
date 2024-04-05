import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetPublicUser } from "../Hooks/UserHooks/UseGetPublicUser";
import { useFollowUser } from "../Hooks/FollowHooks/UseFollowUser";
import { useUserContext } from "../Contexts/UserContext";
import { FollowButtons } from "./FollowButtons";
import { LoadingRing } from "./LoadingRing";
import links from "../Utils/Links";
import { ImageComponent } from "./ImageComponent";

export const User = () => {
  const { id } = useParams();
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
      const { response, json } = await getPublicUser(id);
      if (response.ok) {
        setFollowerNumber(json.followerNumber);
        setFollowingNumber(json.followingNumber);
        setUser(json);
        setFollowing(json?.followers?.includes(globalUser?._id));
        const date = new Date(json.createdAt);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        setMemberSince(formattedDate);
      }
    };
    get();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setUser]);

  if (!user) {
    return;
  }
  return (
    <div className="container mt-3">
      {isLoading ? (
        <LoadingRing />
      ) : (
        <div className="row">
          <div className="col col-12 col-lg-3">
            <div className="d-flex justify-content-center">
              <ImageComponent src={user?.image} type={"large"} />
            </div>
            <div className="text-center">
              <h1 className="fw-bold"> {user.username}</h1>
              <p className="mt-3">
                They have been a member of the website since{" "}
                <span className="fw-bold">{memberSince}</span>
              </p>
              <Link className="unstyled-link" to={links.allArticles(user._id)}>
                <button type="button" className="btn btn-primary">
                  See all of their articles...
                </button>
              </Link>
            </div>
            {globalUser && user._id !== globalUser?._id && (
              <div className="text-center">
                <button
                  disabled={followLoading}
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    handleFollow(user._id);
                  }}
                >
                  {following ? "Unfollow" : "Follow"}
                </button>
              </div>
            )}
            <div className="mt-4 d-flex justify-content-center">
              <FollowButtons
                id={user._id}
                followerNumber={followerNumber}
                followingNumber={followingNumber}
              />
            </div>
          </div>
          <div className="col col-12 col-lg-9 d-flex flex-column mt-4 align-items-center">
            <h2>Top 10 Articles Of The User</h2>
            <div className="my-4">
              {user?.mostLikedArticles?.length === 0 && (
                <div className="text-center">
                  <h3>
                    <i className="bi bi-emoji-frown h1 me-2"></i>
                    <b>They do not have any liked articles yet.</b>
                  </h3>
                  <h4>
                    <Link
                      className="unstyled-link me-2 text-decoration-underline"
                      to={links.allArticles(user._id)}
                    >
                      Check out all of their articles!
                    </Link>
                    Who knows, You might end up liking some of them.
                  </h4>
                </div>
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
                      className="unstyled-link"
                      to={links.article(article._id)}
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
