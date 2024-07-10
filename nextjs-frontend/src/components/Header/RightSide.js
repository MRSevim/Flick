"use client";
import { useUserContext } from "@/contexts/UserContext";
import { DarkModeToggle } from "./DarkModeToggle";
import Link from "next/link";
import links from "@/utils/Links";
import { Image } from "../Image";

const RightSide = () => {
  const [user] = useUserContext();
  return (
    <>
      {!user && <DarkModeToggle />}
      {/*  {user && (
        <>
          <PmIcon />
          <Notifications />
        </>
      )} */}
      {user ? (
        <div ref={wrapperRef} className="position-relative">
          <div
            onClick={() => {
              setUserMenu((prev) => !prev);
            }}
            className="text-end pointer"
          >
            <Image src={user.image} classes={"profile-img-mini"} />
          </div>
          {userMenu && (
            <UserMenu
              setUserMenu={setUserMenu}
              logOut={logOut}
              myId={myId}
              user={user}
            />
          )}
        </div>
      ) : (
        <div className="text-end user-container">
          <Link href={links.login}>
            <button type="button" className="btn btn-outline-light me-2">
              Login
            </button>
          </Link>
          <Link href={links.signup()}>
            <button type="button" className="btn btn-secondary">
              Sign-up
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default RightSide;
