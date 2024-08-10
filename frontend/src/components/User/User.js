"use client";
import { useConfirmationContext } from "@/contexts/ConfirmationContext";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import { useUserContext } from "@/contexts/UserContext";
import { FollowButtons } from "../FollowButtons";
import Link from "next/link";
import links from "@/utils/Links";
import { LikeButton } from "../LikeButton";
import { RoleBanner } from "../RoleBanner";
import { Image } from "../Image";
import NextImage from "next/image";
import { addDarkBg, confirmationWrapper } from "@/utils/HelperFuncs";
import { FollowAndMessageButtons } from "./FollowAndMessageButtons";
import { useBanUser } from "@/hooks/UseBanUser";
import { useRouter } from "next/navigation";

export const User = ({ json }) => {
  const [globalUser] = useUserContext();
  const user = json;
  const router = useRouter();
  const [darkMode] = useDarkModeContext();
  const { confirmation, setConfirmation } = useConfirmationContext();
  const { _banUser, isLoading: banLoading } = useBanUser();
  const followerNumber = json.followerNumber;
  const followingNumber = json.followingNumber;
  const following = json.followers.includes(globalUser?._id);

  const date = new Date(json.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const memberSince = formattedDate;

  const banUser = async (id) => {
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
        return await _banUser(id, reason);
      },
      () => {
        setConfirmation((prev) => ({
          ...prev,
          info: { ...prev.info, reason: "" },
        }));
        router.push(links.homepage);
      }
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col col-12 col-lg-4">
          <div className="d-flex justify-content-center">
            <Image src={user?.image} classes={"profile-img"} />
          </div>
          <div className="text-center">
            <h1 className="fw-bold text-wrap text-break"> {user.username}</h1>
            <RoleBanner role={user?.role} />
            <p className="mt-3">
              Member since <span className="fw-bold">{memberSince}</span>
            </p>
            <Link className="unstyled-link" href={links.allArticles(user._id)}>
              <button type="button" className="btn btn-primary">
                See all of their articles...
              </button>
            </Link>
          </div>
          {globalUser && user._id !== globalUser?._id && (
            <FollowAndMessageButtons user={user} following={following} />
          )}
          {(globalUser?.role === "admin" || globalUser?.role === "mod") &&
            globalUser?._id !== user?._id && (
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
          <h2 className="m-0">Top 10 Latest Articles Of The User</h2>
          <div className="m-4 mt-2 w-100">
            {user.mostLikedArticles.length === 0 && (
              <div className="text-center row mt-3">
                <h3 className="col col-12 col-lg-4">
                  <NextImage
                    className="rounded w-100 h-auto"
                    priority={true}
                    src="/images/sad.jpg"
                    alt="sad face"
                    sizes="100%"
                    width={0}
                    height={0}
                  />
                </h3>
                <div className="col col-12 col-lg-8 d-flex flex-column justify-content-center">
                  <h3 className="m-0">They do not have any articles yet.</h3>
                </div>
              </div>
            )}
            {user.mostLikedArticles.map((article) => (
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
                      href={links.article(article._id)}
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
    </div>
  );
};
