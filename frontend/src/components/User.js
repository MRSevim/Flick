import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetPublicUser } from "../Hooks/UserHooks/UseGetPublicUser";
import { useFollowUser } from "../Hooks/FollowHooks/UseFollowUser";
import { useUserContext } from "../Contexts/UserContext";
import { FollowButtons } from "./FollowButtons";
import { LoadingRing } from "./LoadingRing";
import links from "../Utils/Links";
import { ImageComponent } from "./ImageComponent";
import sad from "../Utils/images/sad.jpg";
import { LikeButton } from "./Articles/LikeButton";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { addDarkBg, confirmationWrapper } from "../Utils/HelperFuncs";
import { RoleBanner } from "./RoleBanner";
import { useConfirmationContext } from "../Contexts/UseConfirmationContext";
import { useBanUser } from "../Hooks/UserHooks/UseBanUser";

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
  const navigate = useNavigate();
  const [darkMode] = useDarkModeContext();
  const { confirmation, setConfirmation } = useConfirmationContext();
  const { banUser: banUserCall, isLoading: banLoading } = useBanUser();

  const handleFollow = async (id) => {
    const { response, json } = await followUser(id);
    if (response.ok) {
      setFollowerNumber(json.followerNumber);
      setFollowingNumber(json.followingNumber);
      setFollowing(!following);
    }
  };

  const banUser = async (_id) => {
    confirmationWrapper(
      confirmation,
      (prev) => {
        return {
          ...confirmation,
          type: "banUser",
          info: {
            ...prev.info,
            username: user.username,
          },
        };
      },
      setConfirmation,
      async (reason) => {
        return await banUserCall(_id, reason);
      },
      () => {
        setConfirmation((prev) => ({
          ...prev,
          info: { ...prev.info, reason: "" },
        }));
        navigate(links.homepage);
      }
    );
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
          <div className="col col-12 col-lg-4">
            <div className="d-flex justify-content-center">
              <ImageComponent src={user?.image} classes={"profile-img"} />
            </div>
            <div className="text-center">
              <h1 className="fw-bold text-wrap text-break"> {user.username}</h1>
              <RoleBanner role={user?.role} />
              <p className="mt-3">
                Member since <span className="fw-bold">{memberSince}</span>
              </p>
              <Link className="unstyled-link" to={links.allArticles(user._id)}>
                <button type="button" className="btn btn-primary">
                  See all of their articles...
                </button>
              </Link>
            </div>
            {globalUser && user._id !== globalUser?._id && (
              <div className="text-center mt-3">
                <button
                  disabled={followLoading}
                  className="btn btn-primary me-3"
                  onClick={() => {
                    handleFollow(user._id);
                  }}
                >
                  {following ? "Unfollow" : "Follow"}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    navigate(links.sendPm(user.username, user._id));
                  }}
                >
                  <i className="bi bi-chat-left"></i>
                </button>
              </div>
            )}
            {(globalUser?.role === "admin" || globalUser?.role === "mod") && (
              <div className="d-flex mt-2 justify-content-center">
                <button
                  disabled={banLoading}
                  onClick={() => {
                    banUser(user?._id);
                  }}
                  className="btn btn-warning"
                >
                  Ban
                </button>
              </div>
            )}
            <div className="mt-2 d-flex justify-content-center">
              <FollowButtons
                id={user._id}
                followerNumber={followerNumber}
                followingNumber={followingNumber}
              />
            </div>
          </div>
          <div className="col col-12 col-lg-8 d-flex flex-column mt-4 align-items-center">
            <h2 className="m-0">Top 10 Articles Of The User</h2>
            <div className="m-4 mt-2 w-100">
              {user?.mostLikedArticles?.length === 0 && (
                <div className="text-center row mt-3">
                  <h3 className="col col-12 col-lg-4">
                    <img src={sad} alt="sad" className="w-100 rounded" />
                  </h3>
                  <div className="col col-12 col-lg-8 d-flex flex-column justify-content-center">
                    <h3 className="m-0">
                      They do not have any liked articles yet.
                    </h3>
                    <h5>
                      <p className="my-3">
                        <button className="btn btn-warning btn-l">
                          <Link
                            className="unstyled-link text-info"
                            to={links.allArticles(user._id)}
                          >
                            Check out all of their articles!
                          </Link>
                        </button>
                      </p>
                      Who knows, You might end up liking some of them.
                    </h5>
                  </div>
                </div>
              )}
              {user?.mostLikedArticles?.map((article) => (
                <div
                  className="bg-secondary rounded text-white m-2 p-2"
                  key={article._id}
                >
                  <li>
                    <span className="line-right">
                      {" "}
                      <LikeButton
                        classes={"p-1 m-1 bg-primary " + addDarkBg(darkMode)}
                        article={article}
                      />
                    </span>
                    <span>
                      <Link
                        className="unstyled-link text-white hovered-link text-break"
                        to={links.article(article._id)}
                      >
                        {article.title}
                      </Link>
                    </span>
                  </li>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
